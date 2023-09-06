import React, { ReactNode, useEffect, useState } from 'react';
import { useCurrencies } from '@lens-protocol/react-web';
import { ReactSwitch } from '@components/ui/react-switch';
import { ReactSelect } from '@components/ui/react-select';
import { ReactInput } from '@components/ui/react-input';
import cn from 'clsx';
import { HeroIcon } from '@components/ui/hero-icon';
import { Button } from '@components/ui/button';
import { Variants } from 'framer-motion';

type CollectProps = {
  collectData: any;
  setCollectData: (obj: any) => void;
  closeModal: () => void;
};

export default function CollectSetting({
  collectData,
  setCollectData,
  closeModal
}: CollectProps): JSX.Element {
  const { data, loading } = useCurrencies();

  //此贴可以收藏
  const [isCollect, setIsCollect] = useState(false);
  //收取费用
  const [isCost, setIsCost] = useState(false);
  //镜像推荐奖励
  const [isReward, setIsReward] = useState(false);
  //限量版
  const [isLimit, setIsLimit] = useState(false);
  //时限
  const [isTimeLimit, setIsTimeLimit] = useState(false);
  //是否只有关注者才能收集
  const [followerOnly, setFollowerOnly] = useState(true);
  //代币种类
  const [currencys, setCurrencys] = useState<any[]>([]);
  //所选的币种数量
  const [amount, setAmount] = useState(0);
  //所选的币种地址
  const [selectAddress, setSelectAddress] = useState<any>({});
  //转发人获取到的收益百分比
  const [referralFee, setReferralFee] = useState(0);
  //该发布的最大收集次数
  const [collectLimit, setCollectLimit] = useState(0);
  //是否保存当前操作
  const [isSave, setIsSave] = useState(false);

  const close = () => {
    // 将这些数据返回给父组件，设置到setCollectData这个方法里
    setCollectData({
      isCollect: isCollect,
      isCost: isCost,
      isReward: isReward,
      isLimit: isLimit,
      isTimeLimit: isTimeLimit,
      followerOnly: followerOnly,
      currencys: currencys,
      amount: amount,
      selectAddress: selectAddress,
      referralFee: referralFee,
      collectLimit: collectLimit
    });
    closeModal();
  };

  useEffect(() => {
    if (!loading && data) {
      setCurrencys(data);
      setSelectAddress(data[0]);
    }
  }, [loading]);

  useEffect(() => {
    if (collectData) {
      setIsCollect(collectData.isCollect || false);
      setIsCost(collectData.isCost || false);
      setIsReward(collectData.isReward || false);
      setIsLimit(collectData.isLimit || false);
      setIsTimeLimit(collectData.isTimeLimit || false);
      setFollowerOnly(collectData.followerOnly || true);
      setAmount(collectData.amount || 0);
      setSelectAddress(collectData.selectAddress || (data ? data[0] : null));
      setReferralFee(collectData.referralFee || 0);
      setCollectLimit(collectData.collectLimit || 0);
    }
  }, [collectData]);

  return (
    <>
      <div className='flex py-[15px] px-[20px] text-sm'>
        <HeroIcon
          iconName='RectangleStackIcon'
          className='h-6 w-6 text-main-accent'
        />
        <span className='ml-[5px]'>Pay settings</span>
      </div>
      <div className='overflow-auto border-t-[1px] border-[#00000014] p-[20px] text-sm'>
        <div className='mb-[20px] flex'>
          <ReactSwitch
            checked={isCollect}
            onChange={(val) => {
              setIsCollect(!!val);
            }}
          >
            <span className='ml-[8px] font-bold text-[#71717a]'>Pay To Show</span>
          </ReactSwitch>
        </div>
        {isCollect ? (
          <div className='pl-[30px]'>
            <div className='mb-[20px]'>
              <p className='mb-[10px] flex text-[16px]'>
                <HeroIcon
                  iconName='CurrencyDollarIcon'
                  className='h-6 w-6 text-main-accent'
                />
                <span className='ml-[5px] text-sm'>Fee</span>
              </p>
              <div className='mb-[20px] flex'>
                <ReactSwitch
                  className='switch-basic'
                  checked={isCost}
                  onChange={(val) => setIsCost(val as boolean)}
                >
                  <span className='ml-[10px] font-bold text-[#71717a]'>
                  Get paid every time someone views your post
                  </span>
                </ReactSwitch>
              </div>
              {isCost ? (
                <>
                  <div className='mb-[20px] flex w-full justify-between'>
                    <div className='w-[60%]'>
                      <p className='mb-[5px]'>price</p>
                      <ReactInput
                        className='w-full rounded-[10px]'
                        type='number'
                        value={amount}
                        onChange={(val) => setAmount(val < 0 ? 0 : val)}
                        defaultValue={0}
                      />
                    </div>
                    <div className='w-[38%]'>
                      <p className='mb-[5px]'>select currency</p>
                      <ReactSelect
                        value={selectAddress}
                        className='w-full'
                        list={currencys}
                        onChange={setSelectAddress}
                      />
                    </div>
                  </div>
                  <div className='w-full'>
                    <p className='mb-[10px] flex text-[16px]'>
                      <HeroIcon
                        iconName='ArrowsRightLeftIcon'
                        className='h-6 w-6 text-main-accent'
                      />
                      <span className='ml-[5px] text-sm'>Referral Rewards</span>
                    </p>
                    <div className='mb-[20px] flex'>
                      <ReactSwitch
                        className='switch-basic'
                        checked={isReward}
                        onChange={(val) => setIsReward(val as boolean)}
                      >
                        <span className='ml-[10px] font-bold text-[#71717a]'>
                        Share your costs with those who amplify your content
                        </span>
                      </ReactSwitch>
                    </div>
                    {isReward ? (
                      <div className='mb-[20px]'>
                        <p className='mb-[5px]'>referral fee</p>
                        <ReactInput
                          className='w-full rounded-[10px]'
                          type='number'
                          value={referralFee}
                          onChange={(val) => setReferralFee(val < 0 ? 0 : val)}
                          defaultValue={0}
                        />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
            <div className='mb-[20px]'>
              <p className='mb-[10px] flex text-[16px]'>
                <HeroIcon
                  iconName='StarIcon'
                  className='h-6 w-6 text-main-accent'
                />
                <span className='ml-[5px] text-sm'>limited edition</span>
              </p>
              <div className='mb-[20px] flex'>
                <ReactSwitch
                  className='switch-basic'
                  checked={isLimit}
                  onChange={(val) => setIsLimit(val as boolean)}
                >
                  <span className='ml-[10px] font-bold text-[#71717a]'>
                  Make your posts unique
                  </span>
                </ReactSwitch>
              </div>
              {isLimit ? (
                <div>
                  <p className='mb-[5px]'>charge limit</p>
                  <ReactInput
                    className='w-full rounded-[10px]'
                    type='number'
                    value={collectLimit}
                    onChange={(val) => setCollectLimit(val ? val : 0)}
                    defaultValue={0}
                  />
                </div>
              ) : (
                ''
              )}
            </div>
            <div className='mb-[20px]'>
              <p className='mb-[10px] flex text-[16px]'>
                <HeroIcon
                  iconName='ClockIcon'
                  className='h-6 w-6 text-main-accent'
                />
                <span className='ml-[5px] text-sm'>time limit</span>
              </p>
              <div className='mb-[20px] flex'>
                <ReactSwitch
                  className='switch-basic'
                  checked={isTimeLimit}
                  onChange={(val) => setIsTimeLimit(val as boolean)}
                >
                  <span className='ml-[10px] font-bold text-[#71717a]'>
                  Paid to view only for the first 24 hours
                  </span>
                </ReactSwitch>
              </div>
            </div>

          </div>
        ) : (
          ''
        )}
      </div>
      <div className='flex justify-end px-[20px] pb-[15px]'>
        <Button
          className='inline-flex justify-center rounded-md border-[2px] border-transparent border-main-accent px-4 py-2 text-sm font-bold text-main-accent hover:bg-main-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          className='ml-[15px] inline-flex justify-center rounded-md border border-transparent bg-main-accent px-4 py-2 text-sm font-bold text-white hover:bg-main-accent/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
          onClick={close}
        >
          Save
        </Button>
      </div>
    </>
  );
}
