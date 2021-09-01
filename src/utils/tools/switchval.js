export function switchtypeVal(data) {
  switch (data.type) {
    case 1:
      data.types = "唱歌"
      break;
    case 2:
      data.types = "跳舞"
      break;
    case 3:
      data.types = "带货"
      break;
    case 4:
      data.types = "情景"
      break;
    case 5:
      data.types = "搞笑"
      break;
    case 6:
      data.types = "美食"
      break;
    case 7:
      data.types = "颜值"
      break;
    case "":
      data.types = "--"
      break;
    default:
      data.types = data.type
      break;
  }
  return data
}
export function changeVal(data, fortype) {
  var changedata = data.map(item => {
    if (fortype == "anchor" || "anchordeil") {
      if (item.commissionRatio) {
        item.commissionRatios = `${item.commissionRatio}%`
      } else {
        item.commissionRatios = `--%`
      }
    }
    if (fortype == "anchordeil") {
      if (item.platWithdrawProportion) {
        item.platWithdrawProportions = `${item.platWithdrawProportion*100}%`
      } else {
        item.platWithdrawProportions = `--%`
      }
    } else if (fortype == "guilds") {
      if (item.platWithdrawProportion) {
        item.platWithdrawProportions = `${item.platWithdrawProportion*100}%`
      } else {
        item.platWithdrawProportions = `--%`
      }
    } else {
      if (item.platWithdrawProportion) {
        item.platWithdrawProportions = `${item.platWithdrawProportion}%`
      } else {
        item.platWithdrawProportions = `--%`
      }
    }


    if (item.withdrawalAmount) {
      item.withdrawalAmounts = `￥${item.withdrawalAmount}`
    } else {
      item.withdrawalAmounts = `￥--`
    }

    if (item.notWithdrawalAmount) {
      item.notWithdrawalAmounts = `￥${item.notWithdrawalAmount}`
    } else {
      item.notWithdrawalAmounts = `￥--`
    }
    switch (item.status) {
      case 0:
        item.statu = "正常"
        break;
      case 1:
        item.statu = "清退"
        break;
      default:
        break;
    }
    return item
  })
  return changedata
}
