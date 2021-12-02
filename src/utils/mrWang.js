/*
  转换时间格式为后端标准
*/
const genTwoLengthNumberString = n => (n >= 10 ? n : '0' + n)

export function dateTimeTrans(d, searchTimeType) {
  if (!d) {
    return ''
  }
  let yy = d.getFullYear()
  let MM = genTwoLengthNumberString(d.getMonth() + 1)
  let dd = genTwoLengthNumberString(d.getDate())
  if (searchTimeType === '日') {
    return yy + '-' + MM + '-' + dd
  }
  if (searchTimeType === '月') {
    return yy + '-' + MM
  }
  if (searchTimeType === '年') {
    return yy
  }
}
