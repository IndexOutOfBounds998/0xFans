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
  let [isCollect, setIsCollect] = useState(false);
  //收取费用
  let [isCost, setIsCost] = useState(false);
  //镜像推荐奖励
  let [isReward, setIsReward] = useState(false);
  //限量版
  let [isLimit, setIsLimit] = useState(false);
  //时限
  let [isTimeLimit, setIsTimeLimit] = useState(false);
  //是否只有关注者才能收集
  let [followerOnly, setFollowerOnly] = useState(true);
  //代币种类
  let [currencys, setCurrencys] = useState<any[]>([]);
  //所选的币种数量
  let [amount, setAmount] = useState(0);
  //所选的币种地址
  let [selectAddress, setSelectAddress] = useState<any>({});
  //转发人获取到的收益百分比
  let [referralFee, setReferralFee] = useState(0);
  //该发布的最大收集次数
  let [collectLimit, setCollectLimit] = useState(0);
  //是否保存当前操作
  let [isSave, setIsSave] = useState(false);

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

  //初始化
  const modelInfo = () => {
    setIsCollect(false);
    setIsCost(false);
    setIsReward(false);
    setIsLimit(false);
    setIsTimeLimit(false);
    setFollowerOnly(true);
    setAmount(0);
    setSelectAddress(data ? data[0] : null);
    setReferralFee(0);
    setCollectLimit(0);
  };

  return (
    <>
      <div className='flex py-[15px] px-[20px] text-sm'>
        <HeroIcon
          iconName='RectangleStackIcon'
          className='h-6 w-6 text-main-accent'
        />
        <span className='ml-[5px]'>付费设置</span>
      </div>
      <div className='overflow-auto border-t-[1px] border-[#00000014] p-[20px] text-sm'>
        <div className='mb-[20px] flex'>
          <ReactSwitch
            checked={isCollect}
            onChange={(val) => {
              modelInfo();
              setIsCollect(!!val);
            }}
          >
            <span className='ml-[8px] font-bold text-[#71717a]'>付费查看</span>
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
                <span className='ml-[5px] text-sm'>收取费用</span>
              </p>
              <div className='mb-[20px] flex'>
                <ReactSwitch
                  className='switch-basic'
                  checked={isCost}
                  onChange={(val) => setIsCost(val as boolean)}
                >
                  <span className='ml-[10px] font-bold text-[#71717a]'>
                    每当有人收藏您的帖子时即可获得报酬
                  </span>
                </ReactSwitch>
              </div>
              {isCost ? (
                <>
                  <div className='mb-[20px] flex w-full justify-between'>
                    <div className='w-[60%]'>
                      <p className='mb-[5px]'>价格</p>
                      <ReactInput
                        className='w-full rounded-[10px]'
                        type='number'
                        value={amount}
                        onChange={(val) => setAmount(val < 0 ? 0 : val)}
                        defaultValue={0}
                      />
                    </div>
                    <div className='w-[38%]'>
                      <p className='mb-[5px]'>选择货币</p>
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
                      <span className='ml-[5px] text-sm'>镜像推荐奖励</span>
                    </p>
                    <div className='mb-[20px] flex'>
                      <ReactSwitch
                        className='switch-basic'
                        checked={isReward}
                        onChange={(val) => setIsReward(val as boolean)}
                      >
                        <span className='ml-[10px] font-bold text-[#71717a]'>
                          与扩大您的内容的人分享您的费用
                        </span>
                      </ReactSwitch>
                    </div>
                    {isReward ? (
                      <div className='mb-[20px]'>
                        <p className='mb-[5px]'>推荐费</p>
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
                <span className='ml-[5px] text-sm'>限量版</span>
              </p>
              <div className='mb-[20px] flex'>
                <ReactSwitch
                  className='switch-basic'
                  checked={isLimit}
                  onChange={(val) => setIsLimit(val as boolean)}
                >
                  <span className='ml-[10px] font-bold text-[#71717a]'>
                    让帖子变的独一无二
                  </span>
                </ReactSwitch>
              </div>
              {isLimit ? (
                <div>
                  <p className='mb-[5px]'>收取限额</p>
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
                <span className='ml-[5px] text-sm'>时间限制</span>
              </p>
              <div className='mb-[20px] flex'>
                <ReactSwitch
                  className='switch-basic'
                  checked={isTimeLimit}
                  onChange={(val) => setIsTimeLimit(val as boolean)}
                >
                  <span className='ml-[10px] font-bold text-[#71717a]'>
                    收藏仅限前24小时
                  </span>
                </ReactSwitch>
              </div>
            </div>
            {/*<div className='mb-[20px]'>*/}
            {/*  <p className='mb-[10px] flex text-[16px]'>*/}
            {/*    <HeroIcon*/}
            {/*      iconName='UserGroupIcon'*/}
            {/*      className='h-6 w-6 text-main-accent'*/}
            {/*    />*/}
            {/*    <span className='ml-[5px] text-sm'>谁可以收藏</span>*/}
            {/*  </p>*/}
            {/*  <div className='mb-[20px] flex'>*/}
            {/*    <ReactSwitch*/}
            {/*      className='switch-basic'*/}
            {/*      checked={followerOnly}*/}
            {/*      onChange={(val) => setFollowerOnly(val as boolean)}*/}
            {/*    >*/}
            {/*      <span className='ml-[10px] font-bold text-[#71717a]'>*/}
            {/*        只有关注者才可以收藏*/}
            {/*      </span>*/}
            {/*    </ReactSwitch>*/}
            {/*  </div>*/}
            {/*</div>*/}
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
