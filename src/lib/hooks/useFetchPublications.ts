import { useState, useEffect } from 'react';
import { ExplorePublicationRequest } from '@lens-protocol/client';
import { getAuthenticatedClient } from '@lib/getAuthenticatedClient';

type useFetchPublicationsArgs = {
  explorePublicationRequest: ExplorePublicationRequest;
};

export function useFetchPublications({
  explorePublicationRequest
}: useFetchPublicationsArgs) {
  const [loading, setLoading] = useState<Boolean>(false);

  const [firstLoading, setFirstLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<any>('');
  const [hasMore, setHasMore] = useState(false);
  const [request, setRequest] = useState<ExplorePublicationRequest | null>(
    null
  );

  const execute = async () => {
    setFirstLoading(true);
    setRequest(explorePublicationRequest);
    fetchData(
      setLoading,
      explorePublicationRequest,
      setData,
      setNextCursor,
      setHasMore
    );
    setFirstLoading(false);
  };

  let loaded = false;
  useEffect(() => {
    if (!loaded) {
      execute();
      loaded = true;
    }
  }, []);

  const next = async () => {
    setLoading(true);
    const lensClient = await getAuthenticatedClient();
    if (request) {
      request.cursor = nextCursor;
      let res = await lensClient.explore.publications(request);
      setLoading(false);
      setData((prevData) => [...prevData, ...res.items]);
      setNextCursor(res.pageInfo.next);
      if (res.pageInfo.next === null) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  };

  const reset = async () => {
    setData([]);
    execute();
  };

  async function fetchData(
    setLoading: any,
    request: ExplorePublicationRequest,
    setData: any,
    setNextCursor: any,
    setHasMore: any
  ) {
    setLoading(true);
    const lensClient = await getAuthenticatedClient();
    let res = await lensClient.explore.publications(request);
    setData((prevData: any) => [...prevData, ...res.items]);
    setNextCursor(res.pageInfo.next);
    if (res.pageInfo.next === null) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
    setLoading(false);
  }

  const changeFilter = async (requestNew: ExplorePublicationRequest) => {
    setRequest(requestNew);
    setData([]);
    fetchData(setLoading, requestNew, setData, setNextCursor, setHasMore);
  };

  return {
    next,
    reset,
    changeFilter,
    hasMore,
    data,
    loading,
    firstLoading
  };
}
