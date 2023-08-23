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
  setCollectData: (obj: any) => void;
};

export default function CollectSetting({
  setCollectData
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
  let [followerOnly, setFollowerOnly] = useState(false);
  //代币种类
  let [currencys, setCurrencys] = useState([]);
  //所选的币种数量
  let [amount, setAmount] = useState(0);
  //所选的币种地址
  let [selectAddress, setSelectAddress] = useState('');
  //转发人获取到的收益百分比
  let [referralFee, setReferralFee] = useState(0);
  //该发布的最大收集次数
  let [collectLimit, setCollectLimit] = useState(0);
  //是否保存当前操作
  let [isSave, setIsSave] = useState(false);

  // 将这些数据返回给父组件，设置到setCollectData这个方法里
  useEffect(() => {
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
      collectLimit: collectLimit,
      isSave: isSave
    });
  }, [
    isCollect,
    isCost,
    isReward,
    isLimit,
    isTimeLimit,
    followerOnly,
    currencys,
    amount,
    selectAddress,
    referralFee,
    collectLimit,
    isSave
  ]);

  useEffect(() => {
    if (!loading && data) {
      setCurrencys(data);
      setSelectAddress(data[0]);
    }
  }, [loading, data]);

  //初始化
  const modelInfo = () => {
    setIsCollect(false);
    setIsCost(false);
    setIsReward(false);
    setIsLimit(false);
    setIsTimeLimit(false);
    setFollowerOnly(false);
    setAmount(0);
    setSelectAddress(data[0]);
    setReferralFee(0);
    setCollectLimit(0);
  };

  return (
    <>
      <div className='flex py-[15px] px-[20px]'>
        <HeroIcon iconName='RectangleStackIcon' />
        <span className='ml-[5px]'>收集设置</span>
      </div>
      <div className='overflow-auto border-t-[1px] border-[#00000014] p-[20px]'>
        <div className='mb-[20px] flex'>
          <ReactSwitch
            className='relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-teal-900 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75'
            checked={isCollect}
            onChange={(val) => {
              modelInfo();
              setIsCollect(val);
            }}
          >
            <span className='ml-[8px] font-bold text-[#71717a]'>
              此贴可以收藏
            </span>
          </ReactSwitch>
        </div>
        {isCollect ? (
          <div className='pl-[30px]'>
            <div className='mb-[20px]'>
              <p className='mb-[10px] flex text-[16px]'>
                <HeroIcon iconName='CurrencyDollarIcon' />
                <span className='ml-[5px]'>收取费用</span>
              </p>
              <div className='mb-[20px] flex'>
                <ReactSwitch
                  className='switch-basic'
                  checked={isCost}
                  onChange={setIsCost}
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
                        onChange={(val) => setAmount(val ? val : 0)}
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
                      <HeroIcon iconName='ArrowsRightLeftIcon' />
                      <span className='ml-[5px]'>镜像推荐奖励</span>
                    </p>
                    <div className='mb-[20px] flex'>
                      <ReactSwitch
                        className='switch-basic'
                        checked={isReward}
                        onChange={setIsReward}
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
                          onChange={(val) => setReferralFee(val ? val : 0)}
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
                <HeroIcon iconName='StarIcon' />
                <span className='ml-[5px]'>限量版</span>
              </p>
              <div className='mb-[20px] flex'>
                <ReactSwitch
                  className='switch-basic'
                  checked={isLimit}
                  onChange={setIsLimit}
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
                <HeroIcon iconName='ClockIcon' />
                <span className='ml-[5px]'>时间限制</span>
              </p>
              <div className='mb-[20px] flex'>
                <ReactSwitch
                  className='switch-basic'
                  checked={isTimeLimit}
                  onChange={setIsTimeLimit}
                >
                  <span className='ml-[10px] font-bold text-[#71717a]'>
                    收藏仅限前24小时
                  </span>
                </ReactSwitch>
              </div>
            </div>
            <div className='mb-[20px]'>
              <p className='mb-[10px] flex text-[16px]'>
                <HeroIcon iconName='UserGroupIcon' />
                <span className='ml-[5px]'>谁可以收藏</span>
              </p>
              <div className='mb-[20px] flex'>
                <ReactSwitch
                  className='switch-basic'
                  checked={followerOnly}
                  onChange={setFollowerOnly}
                >
                  <span className='ml-[10px] font-bold text-[#71717a]'>
                    只有关注者才可以收藏
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
        <Button className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'>
          Cancel
        </Button>
        <Button className='ml-[15px] inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'>
          Save
        </Button>
      </div>
    </>
  );
}
