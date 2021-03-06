import Vue from 'vue';
import request from '@/utils/request';
import store from '@/store'
// 获取导航配置列表
export function getList (params) {
  return request({
    url: '/homeBar/homeBarList',
    method: 'get',
    params
  })
}
// 导航列表操作复制
export function copyHomeBar (params) {
  return request({
    url: '/homeBar/copyHomeBar',
    method: 'post',
    params
  })
}
// 导航列表操作发布
export function publish (params) {
  return request({
    url: '/homeBar/publishHomeBar',
    method: 'post',
    params
  })
}
// 导航列表操作删除
export function deleteHome (params) {
  return request({
    url: '/homeBar/deleteHomeBar',
    method: 'post',
    params
  })
}
// 导航列表操作详情
export function BarDetail (params) {
  return request({
    url: '/homeBar/HomeBarDetail',
    method: 'get',
    params
  })
}
// 导航列表校验
export function verify (params) {
  return request({
    url: '/homeBar/verify',
    method: 'post',
    params
  })
}
export function addHomeBars (params) {
  return request({
    url: '/homeBar/saveHomeBar',
    method: 'post',
    data:params,
  })
}
export function updateHomeBar (params) {
  return request({
    url: '/homeBar/updateHomeBar',
    method: 'post',
    data:params,
  })
}
