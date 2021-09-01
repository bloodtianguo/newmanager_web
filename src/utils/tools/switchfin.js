export function switchtypeFin(data) {
  var datas=""
  switch (data) {
    case 0:
      datas = "申请中"
      break;
    case 1:
      datas = "打款中"
      break;
    case 2:
      datas= "挂起"
      break;
    case 3:
      datas = "已打款"
      break;
    case 4:
      datas= "已拒绝"
      break;
    case 5:
      datas = "打款失败"
      break;
    default:
      datas = "--"
      break;
  }
  return datas
}
