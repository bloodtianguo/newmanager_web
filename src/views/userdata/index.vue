<!--name-->
<template>
  <section class="userdata">
    <div class="top_t">
      <span
        v-for="(v, i) in toplist"
        :key="i"
        :class="{ top_ac: topIdx == i, ac1: i == 0, ac3: i == 2 }"
        @click="topChangeClick(i)"
        >{{ v.title }}</span
      >
    </div>
    <div class="tj_tit showbg">
      数据统计
      <span class="moe" @mouseover="sover" @mouseleave="seave"></span>
      <div class="newbg" v-show="topIdx == 0 && off.showTitle">
        用户数据(每日00:00:00更新数据）<br />
        注册用户量：没找APP已注册用户数；<br />
        日活跃用户：登录没找APP用户数，不重复统计；<br />
        启动量：用户进入APP的次数；<br />
        用户平均使用时长：每日每人平均使用APP有效时长
      </div>
      <div class="newbg" v-show="topIdx == 1 && off.showTitle">
        短视频数据(每日00:00:00更新数据）<br />
        视频发布数量：用户发布视频并审核成功视频数量；<br />
        发布视频人数：成功发布视频人数；<br />
        审核未通过视频：未通过的视频数量；<br />
        已删除视频：已删除/已下架的视频数量；
      </div>
      <div class="newbg" v-show="topIdx == 2 && off.showTitle">
        交易数据(每日00:00:00更新数据）<br />
        充值金额：用户充值找币金额；<br />
        打赏数量：用户送礼数量；<br />
        提现金额：用户提现金额；<br />
        充值人数：充值找币人数；
      </div>
    </div>
    <div class="meun" v-if="topIdx == 0">
      <section class="meun1">
        <div class="flexcenter marbtm78">
          <span class="bk userbk1"></span>
          <span> 用户平均使用时长 </span>
        </div>
        <div class="flexcenter martopbtm">
          <span>昨日：</span>
          <span class="fs"> {{ userjson.useTimeStr }} </span>
        </div>
        <div class="flexbetwen">
          <div class="flexcenter newcurson">
            <span>环比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="userjson.useTimeCC >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(userjson.useTimeCC) }}%</span
            >
            <div class="showts">
              对比{{ showTime }}日{{ userjson.useTimeCC > 0 ? '上升' : '下降'
              }}{{ Math.abs(userjson.useTimeCC) }}%
            </div>
          </div>
          <div class="flexcenter newcurson">
            <span>同比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="userjson.useTimeYY >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(userjson.useTimeYY) }}%</span
            >
            <div class="showts">
              对比{{ sevenDay }}日{{ userjson.useTimeYY > 0 ? '上升' : '下降'
              }}{{ Math.abs(userjson.useTimeYY) }}%
            </div>
          </div>
        </div>
      </section>
      <section class="meun2">
        <div class="flexcenter">
          <span class="bk userbk2"></span>
          <span>日活跃用户</span>
        </div>
        <div class="flexbetwen martop40">
          <span>合计：</span>
          <span
            >{{ numMarke(userjson.allUserCount)
            }}<span class="fs12">人</span></span
          >
        </div>
        <div class="flexcenter martopbtm">
          <span>昨日：</span>
          <span class="fs"
            >{{ numMarke(userjson.userCount)
            }}<span class="fs18">人</span></span
          >
        </div>
        <div class="flexbetwen">
          <div class="flexcenter newcurson">
            <span>环比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="userjson.userCountCC >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(userjson.userCountCC) }}%</span
            >
            <div class="showts">
              对比{{ showTime }}日{{ userjson.userCountCC > 0 ? '上升' : '下降'
              }}{{ Math.abs(userjson.userCountCC) }}%
            </div>
          </div>
          <div class="flexcenter newcurson">
            <span>同比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="userjson.userCountYY >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(userjson.userCountYY) }}%</span
            >
            <div class="showts">
              对比{{ sevenDay }}日{{ userjson.userCountYY > 0 ? '上升' : '下降'
              }}{{ Math.abs(userjson.userCountYY) }}%
            </div>
          </div>
        </div>
      </section>
      <section class="meun3">
        <div class="flexcenter">
          <span class="bk userbk3"></span>
          <span>启动量</span>
        </div>
        <div class="flexbetwen martop40">
          <span>合计：</span>
          <span
            >{{ numMarke(userjson.allStartCount)
            }}<span class="fs12">次</span></span
          >
        </div>
        <div class="flexcenter martopbtm">
          <span>昨日：</span>
          <span class="fs"
            >{{ numMarke(userjson.startCount)
            }}<span class="fs18">次</span></span
          >
        </div>
        <div class="flexbetwen">
          <div class="flexcenter newcurson">
            <span>环比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="userjson.startCountCC >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(userjson.startCountCC) }}%</span
            >
            <div class="showts">
              对比{{ showTime }}日{{
                userjson.startCountCC > 0 ? '上升' : '下降'
              }}{{ Math.abs(userjson.startCountCC) }}%
            </div>
          </div>
          <div class="flexcenter newcurson">
            <span>同比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="userjson.startCountYY >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(userjson.startCountYY) }}%</span
            >
            <div class="showts">
              对比{{ sevenDay }}日{{
                userjson.startCountYY > 0 ? '上升' : '下降'
              }}{{ Math.abs(userjson.startCountYY) }}%
            </div>
          </div>
        </div>
      </section>
      <section class="meun4">
        <div class="flexcenter">
          <span class="bk userbk4"></span>
          <span>注册用户量</span>
        </div>
        <div class="flexbetwen martop40">
          <span>合计：</span>
          <span
            >{{ numMarke(userjson.allRegisterCount)
            }}<span class="fs12">人</span></span
          >
        </div>
        <div class="flexcenter martopbtm">
          <span>昨日：</span>
          <span class="fs"
            >{{ numMarke(userjson.registerCount)
            }}<span class="fs18">人</span></span
          >
        </div>
        <div class="flexbetwen">
          <div class="flexcenter newcurson">
            <span>环比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="userjson.registerCountCC >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(userjson.registerCountCC) }}%</span
            >
            <div class="showts">
              对比{{ showTime }}日{{
                userjson.registerCountCC > 0 ? '上升' : '下降'
              }}{{ Math.abs(userjson.registerCountCC) }}%
            </div>
          </div>
          <div class="flexcenter newcurson">
            <span>同比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="userjson.registerCountYY >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(userjson.registerCountYY) }}%</span
            >
            <div class="newsht">
              对比{{ sevenDay }}日{{
                userjson.registerCountYY > 0 ? '上升' : '下降'
              }}{{ Math.abs(userjson.registerCountYY) }}%
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="meun" v-else-if="topIdx == 1">
      <section class="meun1">
        <div class="flexcenter">
          <span class="bk video1"></span>
          <span> 视频发布数量 </span>
        </div>
        <div class="flexbetwen martop40">
          <span>合计：</span>
          <span
            >{{ numMarke(videojson.allPublishVideoCount)
            }}<span class="fs12">条</span></span
          >
        </div>
        <div class="flexcenter martopbtm">
          <span>昨日：</span>
          <span class="fs"
            >{{ numMarke(videojson.publishVideoCount)
            }}<span class="fs18">条</span></span
          >
        </div>
        <div class="flexbetwen">
          <div class="flexcenter newcurson">
            <span>环比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="videojson.publishVideoCountCC >= 0">
              </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(videojson.publishVideoCountCC) }}%</span
            >
            <div class="showts">
              对比{{ showTime }}日{{
                videojson.publishVideoCountCC > 0 ? '上升' : '下降'
              }}{{ Math.abs(videojson.publishVideoCountCC) }}%
            </div>
          </div>
          <div class="flexcenter newcurson">
            <span>同比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="videojson.publishVideoCountYY >= 0">
              </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(videojson.publishVideoCountYY) }}%</span
            >
            <div class="showts">
              对比{{ sevenDay }}日{{
                videojson.publishVideoCountYY > 0 ? '上升' : '下降'
              }}{{ Math.abs(videojson.publishVideoCountYY) }}%
            </div>
          </div>
        </div>
      </section>
      <section class="meun2">
        <div class="flexcenter">
          <span class="bk video2"></span>
          <span>发布视频人数</span>
        </div>
        <div class="flexbetwen martop40">
          <span>合计：</span>
          <span
            >{{ numMarke(videojson.allPublishVideoUserCount)
            }}<span class="fs12">人</span></span
          >
        </div>
        <div class="flexcenter martopbtm">
          <span>昨日：</span>
          <span class="fs"
            >{{ numMarke(videojson.publishVideoUserCount)
            }}<span class="fs18">人</span></span
          >
        </div>
        <div class="flexbetwen">
          <div class="flexcenter newcurson">
            <span>环比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="videojson.publishVideoUserCountCC >= 0">
              </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(videojson.publishVideoUserCountCC) }}%</span
            >
            <div class="showts">
              对比{{ showTime }}日{{
                videojson.publishVideoUserCountCC > 0 ? '上升' : '下降'
              }}{{ Math.abs(videojson.publishVideoUserCountCC) }}%
            </div>
          </div>
          <div class="flexcenter newcurson">
            <span>同比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="videojson.publishVideoUserCountYY >= 0">
              </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(videojson.publishVideoUserCountYY) }}%</span
            >
            <div class="showts">
              对比{{ sevenDay }}日{{
                videojson.publishVideoUserCountYY > 0 ? '上升' : '下降'
              }}{{ Math.abs(videojson.publishVideoUserCountYY) }}%
            </div>
          </div>
        </div>
      </section>
      <section class="meun3">
        <div class="flexcenter">
          <span class="bk video3"></span>
          <span>审核未通过视频</span>
        </div>
        <div class="flexbetwen martop40">
          <span>合计：</span>
          <span
            >{{ numMarke(videojson.allRefuseVideoCount)
            }}<span class="fs12">条</span></span
          >
        </div>
        <div class="flexcenter martopbtm">
          <span>昨日：</span>
          <span class="fs"
            >{{ numMarke(videojson.refuseVideoCount)
            }}<span class="fs18">条</span></span
          >
        </div>
        <div class="flexbetwen">
          <div class="flexcenter newcurson">
            <span>环比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="videojson.refuseVideoCountCC >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(videojson.refuseVideoCountCC) }}%</span
            >
            <div class="showts">
              对比{{ showTime }}日{{
                videojson.refuseVideoCountCC > 0 ? '上升' : '下降'
              }}{{ Math.abs(videojson.refuseVideoCountCC) }}%
            </div>
          </div>
          <div class="flexcenter newcurson">
            <span>同比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="videojson.refuseVideoCountYY >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(videojson.refuseVideoCountYY) }}%</span
            >
            <div class="showts">
              对比{{ sevenDay }}日{{
                videojson.refuseVideoCountYY > 0 ? '上升' : '下降'
              }}{{ Math.abs(videojson.refuseVideoCountYY) }}%
            </div>
          </div>
        </div>
      </section>
      <section class="meun4">
        <div class="flexcenter">
          <span class="bk video4"></span>
          <span>已删除/已下架视频</span>
        </div>
        <div class="flexbetwen martop40">
          <span>合计：</span>
          <span
            >{{ numMarke(videojson.allDelVideoCount)
            }}<span class="fs12">条</span></span
          >
        </div>
        <div class="flexcenter martopbtm">
          <span>昨日：</span>
          <span class="fs"
            >{{ numMarke(videojson.delVideoCount)
            }}<span class="fs18">条</span></span
          >
        </div>
        <div class="flexbetwen">
          <div class="flexcenter newcurson">
            <span>环比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="videojson.delVideoCountCC >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(videojson.delVideoCountCC) }}%</span
            >
            <div class="showts">
              对比{{ showTime }}日{{
                videojson.delVideoCountCC > 0 ? '上升' : '下降'
              }}{{ Math.abs(videojson.delVideoCountCC) }}%
            </div>
          </div>
          <div class="flexcenter newcurson">
            <span>同比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="videojson.delVideoCountYY >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(videojson.delVideoCountYY) }}%</span
            >
            <div class="newsht">
              对比{{ sevenDay }}日{{
                videojson.delVideoCountYY > 0 ? '上升' : '下降'
              }}{{ Math.abs(videojson.delVideoCountYY) }}%
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="meun" v-else>
      <section class="meun1">
        <div class="flexcenter">
          <span class="bk deal1"></span>
          <span> 打赏数量(找币) </span>
        </div>
        <div class="flexbetwen martop40">
          <span>合计：</span>
          <span
            >{{ numMarke(dealjson.allRewardFunCount)
            }}<span class="fs12">个</span></span
          >
        </div>
        <div class="flexcenter martopbtm">
          <span>昨日：</span>
          <span class="fs"
            >{{ numMarke(dealjson.rewardFunCount)
            }}<span class="fs18">个</span></span
          >
        </div>
        <div class="flexbetwen">
          <div class="flexcenter newcurson">
            <span>环比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="dealjson.rewardFunCountCC >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(dealjson.rewardFunCountCC) }}%</span
            >
            <div class="showts">
              对比{{ showTime }}日{{
                dealjson.rewardFunCountCC > 0 ? '上升' : '下降'
              }}{{ Math.abs(dealjson.rewardFunCountCC) }}%
            </div>
          </div>
          <div class="flexcenter newcurson">
            <span>同比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="dealjson.rewardFunCountYY >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(dealjson.rewardFunCountYY) }}%</span
            >
            <div class="showts">
              对比{{ sevenDay }}日{{
                dealjson.rewardFunCountYY > 0 ? '上升' : '下降'
              }}{{ Math.abs(dealjson.rewardFunCountYY) }}%
            </div>
          </div>
        </div>
      </section>
      <section class="meun2">
        <div class="flexcenter">
          <span class="bk deal2"></span>
          <span>充值金额</span>
        </div>
        <div class="flexbetwen martop40">
          <span>合计：</span>
          <span
            >{{ numMarke(dealjson.allRechargeCount)
            }}<span class="fs12">元</span></span
          >
        </div>
        <div class="flexcenter martopbtm">
          <span>昨日：</span>
          <span class="fs"
            >{{ numMarke(dealjson.rechargeCount)
            }}<span class="fs18">元</span></span
          >
        </div>
        <div class="flexbetwen">
          <div class="flexcenter newcurson">
            <span>环比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="dealjson.rechargeCountCC >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(dealjson.rechargeCountCC) }}%</span
            >
            <div class="showts">
              对比{{ showTime }}日{{
                dealjson.rechargeCountCC > 0 ? '上升' : '下降'
              }}{{ Math.abs(dealjson.rechargeCountCC) }}%
            </div>
          </div>
          <div class="flexcenter newcurson">
            <span>同比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="dealjson.rechargeCountYY >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(dealjson.rechargeCountYY) }}%</span
            >
            <div class="showts">
              对比{{ sevenDay }}日{{
                dealjson.rechargeCountYY > 0 ? '上升' : '下降'
              }}{{ Math.abs(dealjson.rechargeCountYY) }}%
            </div>
          </div>
        </div>
      </section>
      <section class="meun3">
        <div class="flexcenter">
          <span class="bk deal3"></span>
          <span>充值人数</span>
        </div>
        <div class="flexbetwen martop40">
          <span>合计：</span>
          <span
            >{{ numMarke(dealjson.allRechargeUserCount)
            }}<span class="fs12">人</span></span
          >
        </div>
        <div class="flexcenter martopbtm">
          <span>昨日：</span>
          <span class="fs"
            >{{ numMarke(dealjson.rechargeUserCount)
            }}<span class="fs18">人</span></span
          >
        </div>
        <div class="flexbetwen">
          <div class="flexcenter newcurson">
            <span>环比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="dealjson.rechargeUserCountCC >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(dealjson.rechargeUserCountCC) }}%</span
            >
            <div class="showts">
              对比{{ showTime }}日{{
                dealjson.rechargeUserCountCC > 0 ? '上升' : '下降'
              }}{{ Math.abs(dealjson.rechargeUserCountCC) }}%
            </div>
          </div>
          <div class="flexcenter newcurson">
            <span>同比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="dealjson.rechargeUserCountYY >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(dealjson.rechargeUserCountYY) }}%</span
            >
            <div class="showts">
              对比{{ sevenDay }}日{{
                dealjson.rechargeUserCountYY > 0 ? '上升' : '下降'
              }}{{ Math.abs(dealjson.rechargeUserCountYY) }}%
            </div>
          </div>
        </div>
      </section>
      <section class="meun4">
        <div class="flexcenter">
          <span class="bk deal4"></span>
          <span>提现金额</span>
        </div>
        <div class="flexbetwen martop40">
          <span>合计：</span>
          <span
            >{{ numMarke(dealjson.allWithdrawalCount)
            }}<span class="fs12">元</span></span
          >
        </div>
        <div class="flexcenter martopbtm">
          <span>昨日：</span>
          <span class="fs"
            >{{ numMarke(dealjson.withdrawalCount)
            }}<span class="fs18">元</span></span
          >
        </div>
        <div class="flexbetwen">
          <div class="flexcenter newcurson">
            <span>环比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="dealjson.withdrawalCountCC >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(dealjson.withdrawalCountCC) }}%</span
            >
            <div class="showts">
              对比{{ showTime }}日{{
                dealjson.withdrawalCountCC > 0 ? '上升' : '下降'
              }}{{ Math.abs(dealjson.withdrawalCountCC) }}%
            </div>
          </div>
          <div class="flexcenter newcurson">
            <span>同比：</span>
            <span class="flexcenter">
              <span class="hb" v-if="dealjson.withdrawalCountYY >= 0"> </span>
              <span class="tb" v-else> </span>
              {{ Math.abs(dealjson.withdrawalCountYY) }}%</span
            >
            <div class="newsht">
              对比{{ sevenDay }}日{{
                dealjson.withdrawalCountYY > 0 ? '上升' : '下降'
              }}{{ Math.abs(dealjson.withdrawalCountYY) }}%
            </div>
          </div>
        </div>
      </section>
    </div>
    <p class="tj_tit">
      {{
        topIdx == 0
          ? '用户数据趋势图'
          : topIdx == 1
          ? '短视频数据趋势图'
          : '交易数据趋势图'
      }}
    </p>
    <section class="eachDom">
      <div class="ec_tishi">
        <div class="ec_btn">
          <span @click="changeMonth(0)" :class="{ ec_ac1: ec_Idx == 0 }"
            >近七天</span
          >
          <span @click="changeMonth(1)" :class="{ ec_ac2: ec_Idx == 1 }"
            >月份</span
          >
        </div>
      </div>
      <!-- <eachartDom :chartsData="eacharts" /> -->
      <div id="mycharts_tree"></div>
    </section>
    <div v-if="topIdx == 0">
      <div class="tj_tit showbg">
        今日实时数据<span
          class="moe"
          @mouseover="sover"
          @mouseleave="seave"
        ></span>
        <div class="mosebg" v-show="off.showTitle">
          今日数据(刷新更新数据）<br />
          注册用户量：今日没找APP注册用户数；<br />
          日活跃用户：今日登录没找APP用户数，不重复统计；<br />
          启动量：今日用户进入APP的次数；<br />
          视频发布数量：今日用户发布视频并审核成功视频数量；<br />
          充值金额：今日用户充值找币金额；
        </div>
      </div>

      <section class="tj_btm">
        <div class="box">
          <p class="p1">注册用户量</p>
          <p class="p2">
            {{ userjson.currentRegisterCount }}<span class="hz">(人)</span>
          </p>
        </div>
        <div class="box">
          <p class="p1">日活跃用户</p>
          <p class="p2">
            {{ userjson.currentUserCount }}<span class="hz">(人)</span>
          </p>
        </div>
        <div class="box">
          <p class="p1">启动量</p>
          <p class="p2">
            {{ userjson.currentStartCount }}<span class="hz">(次)</span>
          </p>
        </div>
        <div class="box">
          <p class="p1">发布视频量</p>
          <p class="p2">
            {{ userjson.currentPublishVideoCount }}<span class="hz">(条)</span>
          </p>
        </div>
        <div class="box">
          <p class="p1">充值金额</p>
          <p class="p2">
            {{ userjson.currentRechargeCount }}<span class="hz">(元)</span>
          </p>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import * as echarts from 'echarts';
import api from '@/api/staticData'
export default {

  components: {},

  data() {
    return {
      showTime: '', // 昨日时间
      sevenDay: '', // 七天前时间
      off: {
        showTitle: false,
        flag: false,
      },
      topIdx: 0,
      ec_Idx: 0,
      toplist: [
        { title: '用户数据' },
        { title: '短视频数据' },
        { title: '交易数据' },
      ],
      userjson: {}, // 用户数据
      videojson: {}, // 视频数据
      dealjson: {}, // 交易数据
      option: {
        grid: {
          top: 80,
          bottom: 50,
          left: 50,
          right: 50
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [],
          },
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'aa',
            type: 'line',
            smooth: true,
            data: [],
            color: '#7987ff',
          },
          {
            type: 'line',
            smooth: true,
            data: [],
            color: '#fe9a32',
          },
          {
            type: 'line',
            smooth: true,
            data: [],
            color: '#c262ff',
          },
          {
            type: 'line',
            smooth: true,
            data: [],
            color: '#ff579f',
          }
        ]
      }
    }
  },
  //监听属性,类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  methods: {
    topChangeClick(i) {
      this.topIdx = i
      localStorage.setItem('currentIdx', i)
      this.ec_Idx = 0
      if (i == 0) { // 用户数据
        this.userget()
        this.userChart(0)
      } else if (i == 1) { // 视频数据
        this.videoget()
        this.videoChart(0)
      } else if (i == 2) { // 交易数据
        this.dealget()
        this.dealChart(0)
      }
    },
    changeMonth(idx) { // 获取统计图数据
      if (this.off.flag) {
        return
      }
      this.off.flag = true
      setTimeout(() => {
        this.off.flag = false
      }, 500);
      this.ec_Idx = idx
      if (this.topIdx == 0) {
        this.userChart(idx)
      } else if (this.topIdx == 1) {
        this.videoChart(idx)
      } else if (this.topIdx == 2) {
        this.dealChart(idx)
      }
    },
    userget() { // 用户数据
      api.getUser().then(res => {
        this.userjson = res.data
      })
    },
    userChart(type) {
      let arr = [], brr = [], crr = [], drr = [], time = []
      api.userChart({ type: type }).then(res => {
        res.data.forEach(v => {
          time.push(v.day)
          brr.push(v.userCount)
          crr.push(v.startCount)
          drr.push(v.registerCount)
        })
        this.option.legend.data = ['日活跃用户', '启动量', '用户注册']
        this.option.xAxis[0].data = time
        this.option.series[0].data = arr
        this.option.series[0].name = ''
        this.option.series[1].name = '日活跃用户'
        this.option.series[2].name = '启动量'
        this.option.series[3].name = '用户注册'
        this.option.series[1].data = brr
        this.option.series[2].data = crr
        this.option.series[3].data = drr
        this.init()
      })
    },
    videoget() {
      api.getVideo().then(res => {
        this.videojson = res.data
      })
    },
    videoChart(type) {
      let arr = [], brr = [], crr = [], drr = [], time = []
      api.videoChart({ type: type }).then(res => {
        res.data.forEach(v => {
          time.push(v.day)
          arr.push(v.publishVideoCount)
          brr.push(v.publishVideoUserCount)
          crr.push(v.refuseVideoCount)
          drr.push(v.delVideoCount)
        })
        this.option.legend.data = ['视频发布数', '视频发布人数', '审核未通过视频', '已删除/已下架视频']
        this.option.xAxis[0].data = time
        this.option.series[0].name = '视频发布数'
        this.option.series[1].name = '视频发布人数'
        this.option.series[2].name = '审核未通过视频'
        this.option.series[3].name = '已删除/已下架视频'
        this.option.series[0].data = arr
        this.option.series[1].data = brr
        this.option.series[2].data = crr
        this.option.series[3].data = drr
        this.init()
      })
    },
    dealget() {
      api.getTransaction().then(res => {
        this.dealjson = res.data
      })
    },
    dealChart(type) {
      let arr = [], brr = [], crr = [], drr = [], time = []
      api.dealChart({ type: type }).then(res => {
        res.data.forEach(v => {
          time.push(v.day)
          arr.push(v.rewardFunCount)
          brr.push(v.rechargeCount)
          crr.push(v.rechargeUserCount)
          drr.push(v.withdrawalCount)
        })
        this.option.legend.data = ['打赏数量', '充值金额', '充值人数', '提现金额']
        this.option.series[0].name = '打赏数量'
        this.option.series[1].name = '充值金额'
        this.option.series[2].name = '充值人数'
        this.option.series[3].name = '提现金额'
        this.option.xAxis[0].data = time
        this.option.series[0].data = arr
        this.option.series[1].data = brr
        this.option.series[2].data = crr
        this.option.series[3].data = drr
        this.init()
      })
    },
    numMarke(num) {
      let result = [], counter = 0
      let str = num = (num || 0).toString()
      let pointIdx = str.indexOf('.')
      const aa = (data) => {
        for (let i = data.length - 1; i >= 0; i--) {
          counter++
          result.unshift(data[i])
          if (!(counter % 3) && i != 0) {
            result.unshift(',')
          }
        }
        return result.join('')
      }
      if (pointIdx > 0) {
        return aa(str.substr(0, pointIdx).split('')) + str.substr(pointIdx)
      } else {
        return aa(str.split(''))
      }
    },
    init() {
      let mycharts_tree = echarts.init(document.getElementById("mycharts_tree"));
      this.$nextTick(() => {
        window.onresize = function () {
          mycharts_tree.resize()
        }
        mycharts_tree.setOption(this.option);
        this.$forceUpdate()
      })
    },
    sover() {
      this.off.showTitle = true
    },
    seave() {
      this.off.showTitle = false
    }
  },
  //生命周期-创建之前
  created() {
    let s = new Date()
    let mon = s.getMonth() + 1, oneday = s.getDate() - 2, seveDay = s.getDate() - 8
    this.showTime = oneday > 0 ? mon + '.' + oneday : mon - 1 + '.' + (30 + oneday) // 对比昨日一天之后的数据
    this.sevenDay = seveDay > 0 ? mon + '.' + seveDay : mon - 1 + '.' + (30 + seveDay) // 对比昨日七天之后的数据
    let str = localStorage.getItem('currentIdx')
    if (str) {
      this.topChangeClick(str)
    } else {
      this.topChangeClick(0)
    }
  },
  //生命周期-挂载完成（可以访问DOM元素）
  mounted() { this.init() },
  // 生命周期-销毁之前
  beforeDestroy() { },
}
</script>
<style scoped lang='scss'>
.userdata {
  height: 100%;
  overflow: auto;
  padding: 1px 18px 20px 20px;
  background: #f6f6f6;
  .top_t {
    display: flex;
    align-items: center;
    border: 1px solid #999999;
    width: 540px;
    height: 50px;
    margin: 21px auto 19px;
    border-radius: 8px;
    span {
      display: inline-block;
      width: 180px;
      font-size: 24px;
      text-align: center;
      font-weight: 500;
      line-height: 50px;
      cursor: pointer;
    }
    .top_ac {
      background-color: #1c223e;
      color: #fff;
    }
    .ac1 {
      border-radius: 8px 0 0 8px;
    }
    .ac3 {
      border-radius: 0 8px 8px 0;
    }
  }
  .tj_tit {
    display: flex;
    align-items: center;
    font-size: 22px;
    margin: 30px 0 22px 0;
    span {
      display: inline-block;
      margin-left: 10px;
      background-image: url('../../assets/images/userdata/mark.png');
      background-repeat: no-repeat;
      width: 20px;
      height: 20px;
      background-size: contain;
    }
  }
  .flexcenter {
    display: flex;
    align-items: center;
  }
  .flexbetwen {
    display: flex;
    justify-content: space-between;
  }
  .meun {
    display: flex;
    justify-content: space-between;
    section {
      width: 24.4%;
      height: 258px;
    }
    .meun1,
    .meun2,
    .meun3,
    .meun4 {
      padding: 24px 30px 30px 30px;
      color: #ffffff;
      font-size: 22px;
      .bk {
        display: inline-block;
        width: 25px;
        height: 25px;
        background-size: contain;
        background-repeat: no-repeat;
        margin-right: 5px;
      }
    }
    .meun1 {
      background: linear-gradient(340deg, #6b7cff 0%, #999fff 100%);
      box-shadow: 0px 6px 8px 0px rgba(151, 157, 255, 0.68);
      border-radius: 8px 83px 8px 8px;
    }
    .meun2 {
      background: linear-gradient(340deg, #fe8f25 0%, #ffc260 100%);
      box-shadow: 0px 6px 8px 0px rgba(254, 189, 90, 0.68);
      border-radius: 8px 83px 8px 8px;
    }
    .meun3 {
      background: linear-gradient(340deg, #b854ff 0%, #e792ff 100%);
      box-shadow: 0px 6px 8px 0px rgba(229, 143, 255, 0.68);
      border-radius: 8px 83px 8px 8px;
    }
    .meun4 {
      background: linear-gradient(340deg, #ff559e 0%, #ff82bd 100%);
      box-shadow: 0px 6px 8px 0px rgba(255, 128, 188, 0.68);
      border-radius: 8px 83px 8px 8px;
    }
    .fs {
      font-size: 42px;
    }
    .fs12 {
      font-size: 12px;
      margin-left: 4px;
    }
    .fs18 {
      font-size: 18px;
      margin-left: 5px;
    }
    .marbtm78 {
      margin-bottom: 78px;
    }
    .martop40 {
      margin-top: 40px;
    }
    .martopbtm {
      margin: 10px 0 20px 0;
    }
    .hb,
    .tb {
      display: inline-block;
      width: 15px;
      height: 19px;
      background-size: contain;
      background-repeat: no-repeat;
      margin-right: 5px;
      position: relative;
    }
    .hb {
      background-image: url('../../assets/images/userdata/add.png');
    }
    .tb {
      background-image: url('../../assets/images/userdata/reduce.png');
    }
    .newcurson {
      cursor: pointer;
      position: relative;
      &:hover {
        .showts {
          display: block;
        }
        .newsht {
          display: block;
        }
      }
    }
    .showts {
      display: none;
      position: absolute;
      top: -30px;
      right: -55px;
      padding: 0 10px;
      background-color: #333333;
      font-size: 17px;
    }
    .newsht {
      display: none;
      position: fixed;
      top: 426px;
      right: 39px;
      padding: 0 10px;
      background-color: #333333;
      font-size: 17px;
      z-index: 99999999;
    }
    .userbk1 {
      background-image: url('../../assets/images/userdata/time.png');
    }
    .userbk2 {
      background-image: url('../../assets/images/userdata/user.png');
    }
    .userbk3 {
      background-image: url('../../assets/images/userdata/action.png');
    }
    .userbk4 {
      background-image: url('../../assets/images/userdata/zc.png');
    }
    .video1 {
      background-image: url('../../assets/images/userdata/number.png');
    }
    .video2 {
      background-image: url('../../assets/images/userdata/numberpeple.png');
    }
    .video3 {
      background-image: url('../../assets/images/userdata/authin.png');
    }
    .video4 {
      background-image: url('../../assets/images/userdata/dele.png');
    }
    .deal1 {
      background-image: url('../../assets/images/userdata/reward.png');
    }
    .deal2 {
      background-image: url('../../assets/images/userdata/investmoney.png');
    }
    .deal3 {
      background-image: url('../../assets/images/userdata/investpeople.png');
    }
    .deal4 {
      background-image: url('../../assets/images/userdata/reflect.png');
    }
  }
  .eachDom {
    width: 100%;
    height: 636px;
    background: #ffffff;
    border-radius: 8px;
    position: relative;
    .ec_tishi {
      position: absolute;
      top: 20px;
      right: 52px;
      font-size: 18px;
      display: flex;
      align-items: center;
      p {
        margin-right: 32px;
      }
      .circle1,
      .circle2,
      .circle3,
      .circle4 {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 8px;
      }
      .circle1 {
        background-color: #7987ff;
      }
      .circle2 {
        background-color: #fe9a32;
      }
      .circle3 {
        background-color: #c262ff;
      }
      .circle4 {
        background-color: #ff579f;
      }
      .ec_btn {
        width: 259px;
        height: 45px;
        border-radius: 10px;
        margin-left: 38px;
        border: 1px solid #999999;
        cursor: pointer;
        z-index: 999;
        span {
          display: inline-block;
          width: 50%;
          font-size: 20px;
          color: #333333;
          line-height: 45px;
          height: 100%;
          text-align: center;
        }
        .ec_ac1,
        .ec_ac2 {
          background: linear-gradient(180deg, #32b5ff 0%, #788aff 100%);
          color: #fff;
        }
        .ec_ac1 {
          border-radius: 7px 0px 0px 7px;
        }
        .ec_ac2 {
          border-radius: 0 7px 7px 0;
        }
      }
    }
    #mycharts_tree {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 95%;
    }
  }
  .showbg {
    position: relative;
    .mosebg {
      font-size: 16px;
      color: #fff;
      padding: 10px 15px 15px 24px;
      position: absolute;
      top: -148px;
      left: 99px;
      // width: 525px;
      height: 150px;
      background-image: url('../../assets/images/userdata/mouse.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
    .newbg {
      font-size: 16px;
      color: #fff;
      padding: 10px 15px 15px 24px;
      position: absolute;
      top: -90px;
      left: 116px;
      // width: 463px;
      height: 131px;
      background-image: url('../../assets/images/userdata/mouse.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
    .moe {
      cursor: pointer;
    }
  }
  .tj_btm {
    display: flex;
    justify-content: space-between;
    .box {
      width: 19%;
      height: 160px;
      background: #ffffff;
      box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.16);
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .p1 {
        font-size: 22px;
        color: #333333;
        margin-bottom: 20px;
      }
      .p2 {
        font-size: 24px;
        color: #999999;
        display: flex;
      }
      .hz {
        display: inline-block;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #999999;
        margin: 10px 0 0 2px;
      }
    }
  }
}
</style>
