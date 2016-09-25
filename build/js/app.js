"use strict";require.config({paths:{vue:"https://cdn.bootcss.com/vue/1.0.26/vue.min",reqwest:"https://cdn.bootcss.com/reqwest/2.0.5/reqwest.min",qwery:"https://cdn.bootcss.com/qwery/4.0.0/qwery"}});var config={filterConditions:[{key:"rate",keyText:"课程评分",values:[{value:"default",text:"不排序"},{value:"desc",text:"从高到低"},{value:"asc",text:"从低到高"}]},{key:"roll",keyText:"点名情况",values:[{value:"default",text:"不限"},{value:"never",text:"从不点名"},{value:"occasionally",text:"偶尔点名"},{value:"often",text:"频繁点名"},{value:"always",text:"必定点名"}]},{key:"exam",keyText:"期末考试",values:[{value:"default",text:"不限"},{value:"paper",text:"论文"},{value:"openBookExam",text:"开卷考试"},{value:"closeBookExam",text:"闭卷考试"}]},{key:"time",keyText:"上课时间",values:[{value:"default",text:"不限"},{value:"40506",text:"周四下午5、6节"},{value:"40708",text:"周四下午7、8节"},{value:"other",text:"其他上课时间"}]},{key:"type",keyText:"课程类型",values:[{value:"default",text:"不限"},{value:"natureScience",text:"自然科学与现代技术"},{value:"societyScience",text:"社会科学与现代技术"},{value:"traditionalCulture",text:"传统文化与世界文明"},{value:"medicalScience",text:"医学与生命科学"},{value:"humanities",text:"人文学科与艺术审美"}]}],rateConditions:[{key:"roll",keyText:"点名情况",values:[{value:"never",text:"从不点名"},{value:"occasionally",text:"偶尔点名"},{value:"often",text:"频繁点名"},{value:"always",text:"必定点名"}]},{key:"exam",keyText:"期末考试",values:[{value:"paper",text:"论文"},{value:"openBookExam",text:"开卷考试"},{value:"closeBookExam",text:"闭卷考试"}]},{key:"teacherScore",keyText:"老师评分",values:[{value:6,text:"6分"},{value:7,text:"7分"},{value:8,text:"8分"},{value:9,text:"9分"},{value:10,text:"10分"}]}],titleBackgroundColor:{hotList:"#db4437",filter:"#03a9f4",rate:"#0f9d58",search:"#fff",help:"#fff",about:"#fff",detail:"#fff"},titleText:{hotList:"热门课程",filter:"筛选",rate:"评分",search:"搜索",help:"帮助",about:"关于",detail:"详情"},MSG:{NETWORK_ERROR:"网络连接失败，请检查网络连接",SHOW_CACHED_DATA:function(e){return"网络连接失败，现在显示的是历史数据（"+e+"）"},SUBMITTING:"正在提交",SUBMIT:"提交",SELECT_COURSE:"请选择你要评分的课程",SUBMIT_SUCCESS:"提交成功，感谢你的分享"}};
"use strict";require(["vue"],function(e){e.filter("courseType",function(e){if(!e)return"";var t={natureScience:"自然科学与现代技术",humanities:"人文学科与艺术审美",medicalScience:"医学与生命科学",societyScience:"社会科学与现代技术",traditionalCulture:"传统文化与世界文明"};return t[e]}),e.filter("courseRoll",function(e){if(!e)return"暂无数据";var t={never:"从不点名",occasionally:"偶尔点名",often:"频繁点名",always:"必定点名"};return t[e]}),e.filter("courseTime",function(e){if(!e)return"";e=e.toString();for(var t=[],r=+e.slice(0,1)-1,n=["周一","周二","周三","周四","周五","周六","周日"],i=0,u=parseInt(e.length/2);i<u;i++){var c=+e.slice(1+2*i,3+2*i);c>9?t.push(c):t.push("0"+c)}return n[r]+t.join("、")+"节"}),e.filter("timeStamp",function(e){if(!e)return"";var t=new Date(parseInt(e));return t.getFullYear()+"年"+(t.getMonth()+1)+"月"+t.getDate()+"日 "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()})});
"use strict";require(["vue","reqwest"],function(t,e){t.component("filter-conditions",{props:{showBtn:{type:Boolean,required:!0},filterOptions:{type:Object,required:!0,default:{rate:"default",roll:"default",exam:"default",type:"default",time:"default"}},filterResult:[],filterLoading:!1,filterError:!1,filterConditions:{type:Array,required:!0,validator:function(t){return!!utils.typeCheck(t,"Array")&&(t.forEach(function(t){return!!(t.key&&t.keyText&&t.values)&&("string"==typeof t.key&&("string"==typeof t.keyText&&(!!Array.isArray(t.values)&&(0!==t.values.length&&void 0))))}),!0)}}},template:' <ul class="main-filter">\n\t\t\t\t\t\t<li v-for="filterCondition in filterConditions">\n\t\t\t\t\t\t\t<h3 @click="expandOrCollapse">\n\t\t\t\t\t\t\t\t<span v-text="filterCondition.keyText"></span><span class="icon-expand"></span>\n\t\t\t\t\t\t\t\t<span class="filter-selected" v-text="filterCondition.values[0].text"></span>\n\t\t\t\t\t\t\t</h3>\n\t\t\t\t\t\t\t<ul class="sub-filter" data-key="{{filterCondition.key}}" @click="changeFilterOption">\n\t\t\t\t\t\t\t\t<li v-for="option in filterCondition.values" data-value="{{option.value}}" v-text="option.text"></li>\n\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<div v-if="showBtn" class="filter-btn" @click="filter">开始筛选</div>\n\t\t\t\t\t</ul>',methods:{expandOrCollapse:function(t){for(var e=t.target;"H3"!==e.nodeName.toUpperCase();)e=e.parentNode;if(e.classList.contains("filter-title-expand"))e.parentNode.style.height="48px",e.classList.remove("filter-title-expand");else{var i=e.parentNode.querySelectorAll("ul li").length,l=40*i+48;e.parentNode.style.height=l+"px",e.classList.add("filter-title-expand")}},changeFilterOption:function(t){var e=t.target,i=e.parentNode.parentNode;if("LI"===e.nodeName.toUpperCase()){var l=i.querySelectorAll("ul")[0],r=e.innerText,n=l.getAttribute("data-key"),a=e.getAttribute("data-value");this.filterOptions[n]=a,i.querySelectorAll("h3 .filter-selected")[0].innerText=r,i.querySelectorAll("h3")[0].click()}},filter:function(){var t=this;this.filterLoading=!0,this.filterError=!1,e({url:"/lessen/filter",type:"json",data:this.filterOptions}).then(function(e){t.filterLoading=!1,window.scrollTo(0,250),0===e.code&&(t.filterResult=e.data)}).fail(function(){t.filterLoading=!1,t.filterError=!0})}}})});
"use strict";var utils={typeCheck:function(t,e){var c={undefined:"[object Undefined]",null:"[object Null]",Array:"[object Array]",Function:"[Function Object]",Nmuber:"[Nmuber Object]",Object:"[object Object]",String:"[String Object]"};return!!e&&(!!c[e]&&Object.prototype.toString.call(t)===c[e])}};
"use strict";function _toConsumableArray(t){if(Array.isArray(t)){for(var e=0,i=Array(t.length);e<t.length;e++)i[e]=t[e];return i}return Array.from(t)}require(["vue","reqwest","qwery"],function(t,e,i){new t({el:"#app",data:{isShowSidebar:!1,showSearch:!1,windowShow:{detail:!1,hotList:!0,filter:!1,rate:!1,search:!1,help:!1,about:!1},loading:{hotList:!0,detail:!1,filter:!1,rate:!1,search:!1},error:{detail:!1,filter:!1,search:!1},slideToHideSidebarPosition:{startX:0,startY:0,movedX:0,movedY:0},slideTabPosition:{startX:0,startY:0},previousSidebar:"hotList",title:"热门课程",titleText:config.titleText,titleBackgroundColor:config.titleBackgroundColor,titleContainerStyle:{"background-color":"#db4437"},tabBarPosition:{transform:"0px"},titleContainerClass:{"tab-expand":!0,"title-reverse":!1},tabContainerClass:{"support-touch":!1},windowContainerClass:{"window-container-expand":!0},hotList:null,searchResult:null,filterResult:null,toast:{show:!1,message:""},filterOptions:{rate:"default",roll:"default",exam:"default",type:"default",time:"default"},filterConditions:config.filterConditions,rateCourseSelected:!1,rateSearchResult:null,rateOptions:{code:"",name:"",teacher:"",time:"",roll:"never",exam:"paper",teacherScore:6,nickname:"",comment:""},detail:{name:"",teacher:"",time:"",type:"",roll:"",rateTimes:"",score:"",commentTimes:"",comments:[]},rateConditions:config.rateConditions},ready:function(){document.addEventListener("touchstart",function(){},!0),"createTouch"in document&&(this.tabContainerClass["support-touch"]=!0),[].concat(_toConsumableArray(i(".main-filter h3"))).forEach(function(t){t.click()}),this.loadHotList("all")},methods:{toggleSidebar:function(){this.isShowSidebar=!this.isShowSidebar},back:function(){this.changeWindow(this.previousSidebar)},preventMask:function(t){t.preventDefault()},changeRateCourse:function(){this.rateCourseSelected=!1},showToast:function(t){var e=this;this.toast.message=t,this.toast.show=!0,clearTimeout(this.toastTimeoutId),this.toastTimeoutId=setTimeout(function(){e.toast.show=!1},3e3)},slideToToggleSidebar:function(t,e){var o=e.type,a=i("#sidebar")[0],s=0,n=0;switch(o){case"touchstart":a.classList.add("on-touch-move"),this.slideToHideSidebarPosition.startX=e.touches[0].clientX,this.slideToHideSidebarPosition.startY=e.touches[0].clientY;break;case"touchmove":s=e.touches[0].clientX-this.slideToHideSidebarPosition.startX,n=Math.abs(e.touches[0].clientY-this.slideToHideSidebarPosition.startY),n<50&&("hide"===t?(s=s>0?0:s,a.style.transform="translateX("+s+"px)",e.preventDefault()):"open"===t&&s>50?(s=s>210?210:s,a.style.transform="translateX("+(-210+s)+"px)",e.preventDefault()):a.style.transform="translateX("+(-210+s)+"px)",this.slideToHideSidebarPosition.movedX=s,this.slideToHideSidebarPosition.movedY=n);break;case"touchend":a.classList.remove("on-touch-move"),"hide"===t&&this.slideToHideSidebarPosition.movedX<-50&&this.slideToHideSidebarPosition.movedY<50?(a.style.transform="translateX(-210px)",a.removeAttribute("style"),this.isShowSidebar=!1,e.preventDefault()):"open"===t&&this.slideToHideSidebarPosition.movedX>50&&this.slideToHideSidebarPosition.movedY<50?(a.style.transform="translateX(0px)",a.removeAttribute("style"),this.isShowSidebar=!0,e.preventDefault()):("hide"===t?a.style.transform="translateX(0px)":"open"===t&&(a.style.transform="translateX(-210px)"),setTimeout(function(){a.removeAttribute("style"),a.classList.remove("on-touch-move")},300)),this.slideToHideSidebarPosition.movedX=0,this.slideToHideSidebarPosition.movedY=0;break;case"touchcancel":a.classList.remove("on-touch-move"),a.removeAttribute("style")}},changeTab:function(t,e){var i=t.target,o=i.parentNode.getElementsByTagName("li"),a=void 0,s=void 0,n=void 0,r=void 0;"LI"===i.nodeName.toUpperCase()&&([].concat(_toConsumableArray(o)).forEach(function(t){t.classList.contains("tab-current")&&(a=+t.getAttribute("data-index")),t.classList.remove("tab-current")}),i.classList.add("tab-current"),s=+i.getAttribute("data-index"),n=i.getAttribute("data-type"),r="translateX("+150*s+"px)",this.tabBarPosition.transform=r,e||this.loadHotList(n,a))},loadHistoryHostlist:function(t,e){var o="",a=void 0;if(t="hotLists"+t.slice(0,1).toUpperCase()+t.slice(1),a=!!window.localStorage[t]&&JSON.parse(window.localStorage[t]),this.loading.hotList=!1,a){var s=new Date(a.time);o+=s.getFullYear()+"年"+(s.getMonth()+1)+"月"+s.getDate()+"日 "+s.getHours()+":"+s.getMinutes()+":"+s.getSeconds(),this.showToast(config.MSG.SHOW_CACHED_DATA(o)),this.hotList=a.data}else{var n={target:i(".tab li")[e]};this.showToast(config.MSG.NETWORK_ERROR),this.changeTab(n,!0)}},loadHotList:function(t,i){var o=this;this.loading.hotList=!0,e({url:"/lessen/hotLists/"+t,type:"json"}).then(function(e){0===e.code?(t="hotLists"+t.slice(0,1).toUpperCase()+t.slice(1),o.hotList=e.data,window.localStorage.removeItem(t),window.localStorage[t]=JSON.stringify(e),o.loading.hotList=!1):o.loadHistoryHostlist(t,i)}).fail(function(){o.loadHistoryHostlist(t,i)})},showDetail:function(t){for(var e=t.target,i=void 0;"LI"!==e.nodeName.toUpperCase();)e=e.parentNode;i=e.getAttribute("data-code"),this.changeWindow("detail"),this.loadDetail(i)},detailRate:function(){var t=this,e=["code","name","teacher","time"];this.changeWindow("rate"),this.rateCourseSelected=!0,e.forEach(function(e){t.rateOptions[e]=t.detail[e]})},loadDetail:function(t){var i=this;this.loading.detail=!0,e({url:"/lessen/detail/"+t,type:"json"}).then(function(t){0===t.code?(i.loading.detail=!1,i.detail=t.data):(i.loading.detail=!1,i.error.detail=!0,i.showToast(config.MSG.NETWORK_ERROR))}).fail(function(){i.loading.detail=!1,i.error.detail=!0,i.showToast(config.MSG.NETWORK_ERROR)})},search:function(t,i){var o=this,a=t.target.value,s=void 0;return"rate"===i?this.rateSearchResult=[]:this.searchResult=[],a?(s={q:a},this.loading[i]=!0,void e({url:"/lessen/search",type:"json",data:s}).then(function(t){0===t.code&&(o.loading[i]=!1,"rate"===i?o.rateSearchResult=t.data:o.searchResult=t.data)}).fail(function(){o.loading[i]=!1,o.showToast(config.MSG.NETWORK_ERROR)})):void(this.searchResult=null)},selectRateCourse:function(t){for(var e=this,i=t.target,o=void 0;"LI"!==i.nodeName.toUpperCase();)i=i.parentNode;o=+i.getAttribute("data-code"),this.rateSearchResult.forEach(function(t){+t.code===o&&(e.rateOptions.code=o,e.rateOptions.name=t.name,e.rateOptions.time=t.time,e.rateOptions.teacher=t.teacher)}),this.rateCourseSelected=!0},submitRate:function(t){var o=this,a=t.target,s=i("#rate-comment")[0],n=i("#rate-options .main-filter>li>h3"),r=i("#rate-search-input")[0];if(!a.classList.contains("submitting")){if(!this.rateOptions.code)return void this.showToast(config.MSG.SELECT_COURSE);a.classList.add("submitting"),a.innerText=config.MSG.SUBMITTING,this.rateOptions.comment=encodeURIComponent(s.innerText),e({url:"/lessen/rate",method:"POST",type:"json",data:{code:this.rateOptions.code,roll:this.rateOptions.roll,exam:this.rateOptions.exam,teacherScore:this.rateOptions.teacherScore,comment:this.rateOptions.comment,nickname:encodeURIComponent(this.rateOptions.nickname)}}).then(function(t){0===t.code?(a.classList.remove("submitting"),a.innerText=config.MSG.SUBMIT,o.showToast(config.MSG.SUBMIT_SUCCESS),o.rateCourseSelected=!1,o.rateOptions.code="",o.rateOptions.name="",o.rateOptions.time="",o.rateOptions.teacher="",o.rateOptions.comment="",o.rateSearchResult=null,s.innerHTML='<p style="color: #999;" id="rate-comment-placeholder">输入你的评价</p>',[].concat(_toConsumableArray(n)).forEach(function(t){t.click()}),r.value=""):(a.innerText=config.MSG.SUBMIT,o.showToast(config.MSG.NETWORK_ERROR),a.classList.remove("submitting"))}).fail(function(){a.innerText=config.MSG.SUBMIT,o.showToast(config.MSG.NETWORK_ERROR),a.classList.remove("submitting")})}},wheel:function(t){var e=i("#tab-container")[0],o=window.getComputedStyle(e,null).getPropertyValue("transform");document.documentElement.clientWidth<900&&(t.preventDefault(),o=o.match(/\-?\d+/g),o=o?+o[4]:0,o=t.deltaY>0?o-150<=-750?-750:o-150:o+150>=0?0:o+150,e.style.transform="translateX("+o+"px)")},changeWindow:function(t){var e=this;Object.keys(this.windowShow).forEach(function(t){e.windowShow[t]&&(e.previousSidebar=t),e.windowShow[t]=!1}),"hotList"===t?(this.titleContainerClass["tab-expand"]=!0,this.windowContainerClass["window-container-expand"]=!0):(this.titleContainerClass["tab-expand"]=!1,this.windowContainerClass["window-container-expand"]=!1),"hotList"!==t&&"rate"!==t&&"filter"!==t?this.titleContainerClass["title-reverse"]=!0:this.titleContainerClass["title-reverse"]=!1,"search"===t||"searchBtn"===t?this.showSearch=!0:this.showSearch=!1,window.scrollTo(0,0),t="searchBtn"===t?"search":t,this.title=this.titleText[t],this.titleContainerStyle["background-color"]=this.titleBackgroundColor[t],this.windowShow[t]=!0,this.isShowSidebar=!1},rateComment:function(t){var e=t.target,o=i("#rate-comment-placeholder"),a=window.getSelection(),s=document.createRange();1===o.length?(o[0].remove(),s.setStart(e,0),s.setEnd(e,0),a.removeAllRanges(),a.addRange(s)):""===e.innerText&&(e.innerHTML='<p style="color: #999;" id="rate-comment-placeholder">输入你的评价</p>')}}})});