"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[343],{7998:(e,t,s)=>{s.d(t,{ConfigCtrl:()=>v,zv:()=>h,uA:()=>m,ExplorerCtrl:()=>x,jb:()=>_,OptionsCtrl:()=>b,AV:()=>u,ThemeCtrl:()=>J,ToastCtrl:()=>F});var o=s(2478);const n=e=>"object"==typeof e&&null!==e,a=new WeakMap,r=new WeakSet,i=(e=Object.is,t=((e,t)=>new Proxy(e,t)),s=(e=>n(e)&&!r.has(e)&&(Array.isArray(e)||!(Symbol.iterator in e))&&!(e instanceof WeakMap)&&!(e instanceof WeakSet)&&!(e instanceof Error)&&!(e instanceof Number)&&!(e instanceof Date)&&!(e instanceof String)&&!(e instanceof RegExp)&&!(e instanceof ArrayBuffer)),i=(e=>{switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:throw e}}),l=new WeakMap,c=((e,t,s=i)=>{const n=l.get(e);if((null==n?void 0:n[0])===t)return n[1];const d=Array.isArray(e)?[]:Object.create(Object.getPrototypeOf(e));return(0,o.jc)(d,!0),l.set(e,[t,d]),Reflect.ownKeys(e).forEach((t=>{if(Object.getOwnPropertyDescriptor(d,t))return;const n=Reflect.get(e,t),i={value:n,enumerable:!0,configurable:!0};if(r.has(n))(0,o.jc)(n,!1);else if(n instanceof Promise)delete i.value,i.get=()=>s(n);else if(a.has(n)){const[e,t]=a.get(n);i.value=c(e,t(),s)}Object.defineProperty(d,t,i)})),Object.preventExtensions(d)}),d=new WeakMap,p=[1,1],u=(i=>{if(!n(i))throw new Error("object required");const l=d.get(i);if(l)return l;let h=p[0];const g=new Set,m=(e,t=++p[0])=>{h!==t&&(h=t,g.forEach((s=>s(e,t))))};let f=p[1];const b=e=>(t,s)=>{const o=[...t];o[1]=[e,...o[1]],m(o,s)},y=new Map,v=e=>{var t;const s=y.get(e);s&&(y.delete(e),null==(t=s[1])||t.call(s))},w=Array.isArray(i)?[]:Object.create(Object.getPrototypeOf(i)),I=t(w,{deleteProperty(e,t){const s=Reflect.get(e,t);v(t);const o=Reflect.deleteProperty(e,t);return o&&m(["delete",[t],s]),o},set(t,i,l,c){const p=Reflect.has(t,i),h=Reflect.get(t,i,c);if(p&&(e(h,l)||d.has(l)&&e(h,d.get(l))))return!0;v(i),n(l)&&(l=(0,o.o5)(l)||l);let f=l;if(l instanceof Promise)l.then((e=>{l.status="fulfilled",l.value=e,m(["resolve",[i],e])})).catch((e=>{l.status="rejected",l.reason=e,m(["reject",[i],e])}));else{!a.has(l)&&s(l)&&(f=u(l));const e=!r.has(f)&&a.get(f);e&&((e,t)=>{if(y.has(e))throw new Error("prop listener already exists");if(g.size){const s=t[3](b(e));y.set(e,[t,s])}else y.set(e,[t])})(i,e)}return Reflect.set(t,i,f,c),m(["set",[i],l,h]),!0}});d.set(i,I);const C=[w,(e=++p[1])=>(f===e||g.size||(f=e,y.forEach((([t])=>{const s=t[1](e);s>h&&(h=s)}))),h),c,e=>{g.add(e),1===g.size&&y.forEach((([e,t],s)=>{if(t)throw new Error("remove already exists");const o=e[3](b(s));y.set(s,[e,o])}));return()=>{g.delete(e),0===g.size&&y.forEach((([e,t],s)=>{t&&(t(),y.set(s,[e]))}))}}];return a.set(I,C),Reflect.ownKeys(i).forEach((e=>{const t=Object.getOwnPropertyDescriptor(i,e);"value"in t&&(I[e]=i[e],delete t.value,delete t.writable),Object.defineProperty(w,e,t)})),I}))=>[u,a,r,e,t,s,i,l,c,d,p],[l]=i();function c(e={}){return l(e)}function d(e,t,s){const o=a.get(e);let n;o||console.warn("Please use proxy object");const r=[],i=o[3];let l=!1;const c=i((e=>{r.push(e),s?t(r.splice(0)):n||(n=Promise.resolve().then((()=>{n=void 0,l&&t(r.splice(0))})))}));return l=!0,()=>{l=!1,c()}}const p=c({history:["ConnectWallet"],view:"ConnectWallet",data:void 0}),u={state:p,subscribe:e=>d(p,(()=>e(p))),push(e,t){e!==p.view&&(p.view=e,t&&(p.data=t),p.history.push(e))},reset(e){p.view=e,p.history=[e]},replace(e){p.history.length>1&&(p.history[p.history.length-1]=e,p.view=e)},goBack(){if(p.history.length>1){p.history.pop();const[e]=p.history.slice(-1);p.view=e}},setData(e){p.data=e}},h={WALLETCONNECT_DEEPLINK_CHOICE:"WALLETCONNECT_DEEPLINK_CHOICE",WCM_VERSION:"WCM_VERSION",RECOMMENDED_WALLET_AMOUNT:9,isMobile:()=>typeof window<"u"&&Boolean(window.matchMedia("(pointer:coarse)").matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)),isAndroid:()=>h.isMobile()&&navigator.userAgent.toLowerCase().includes("android"),isIos(){const e=navigator.userAgent.toLowerCase();return h.isMobile()&&(e.includes("iphone")||e.includes("ipad"))},isHttpUrl:e=>e.startsWith("http://")||e.startsWith("https://"),isArray:e=>Array.isArray(e)&&e.length>0,formatNativeUrl(e,t,s){if(h.isHttpUrl(e))return this.formatUniversalUrl(e,t,s);let o=e;o.includes("://")||(o=e.replaceAll("/","").replaceAll(":",""),o=`${o}://`),o.endsWith("/")||(o=`${o}/`),this.setWalletConnectDeepLink(o,s);return`${o}wc?uri=${encodeURIComponent(t)}`},formatUniversalUrl(e,t,s){if(!h.isHttpUrl(e))return this.formatNativeUrl(e,t,s);let o=e;o.endsWith("/")||(o=`${o}/`),this.setWalletConnectDeepLink(o,s);return`${o}wc?uri=${encodeURIComponent(t)}`},wait:async e=>new Promise((t=>{setTimeout(t,e)})),openHref(e,t){window.open(e,t,"noreferrer noopener")},setWalletConnectDeepLink(e,t){try{localStorage.setItem(h.WALLETCONNECT_DEEPLINK_CHOICE,JSON.stringify({href:e,name:t}))}catch{console.info("Unable to set WalletConnect deep link")}},setWalletConnectAndroidDeepLink(e){try{const[t]=e.split("?");localStorage.setItem(h.WALLETCONNECT_DEEPLINK_CHOICE,JSON.stringify({href:t,name:"Android"}))}catch{console.info("Unable to set WalletConnect android deep link")}},removeWalletConnectDeepLink(){try{localStorage.removeItem(h.WALLETCONNECT_DEEPLINK_CHOICE)}catch{console.info("Unable to remove WalletConnect deep link")}},setModalVersionInStorage(){try{typeof localStorage<"u"&&localStorage.setItem(h.WCM_VERSION,"2.6.2")}catch{console.info("Unable to set Web3Modal version in storage")}},getWalletRouterData(){var e;const t=null==(e=u.state.data)?void 0:e.Wallet;if(!t)throw new Error('Missing "Wallet" view data');return t}},g=c({enabled:typeof location<"u"&&(location.hostname.includes("localhost")||location.protocol.includes("https")),userSessionId:"",events:[],connectedWalletId:void 0}),m={state:g,subscribe:e=>d(g.events,(()=>e(function(e,t){const s=a.get(e);s||console.warn("Please use proxy object");const[o,n,r]=s;return r(o,n(),t)}(g.events[g.events.length-1])))),initialize(){g.enabled&&typeof(null==crypto?void 0:crypto.randomUUID)<"u"&&(g.userSessionId=crypto.randomUUID())},setConnectedWalletId(e){g.connectedWalletId=e},click(e){if(g.enabled){const t={type:"CLICK",name:e.name,userSessionId:g.userSessionId,timestamp:Date.now(),data:e};g.events.push(t)}},track(e){if(g.enabled){const t={type:"TRACK",name:e.name,userSessionId:g.userSessionId,timestamp:Date.now(),data:e};g.events.push(t)}},view(e){if(g.enabled){const t={type:"VIEW",name:e.name,userSessionId:g.userSessionId,timestamp:Date.now(),data:e};g.events.push(t)}}},f=c({chains:void 0,walletConnectUri:void 0,isAuth:!1,isCustomDesktop:!1,isCustomMobile:!1,isDataLoaded:!1,isUiLoaded:!1}),b={state:f,subscribe:e=>d(f,(()=>e(f))),setChains(e){f.chains=e},setWalletConnectUri(e){f.walletConnectUri=e},setIsCustomDesktop(e){f.isCustomDesktop=e},setIsCustomMobile(e){f.isCustomMobile=e},setIsDataLoaded(e){f.isDataLoaded=e},setIsUiLoaded(e){f.isUiLoaded=e},setIsAuth(e){f.isAuth=e}},y=c({projectId:"",mobileWallets:void 0,desktopWallets:void 0,walletImages:void 0,chains:void 0,enableAuthMode:!1,enableExplorer:!0,explorerExcludedWalletIds:void 0,explorerRecommendedWalletIds:void 0,termsOfServiceUrl:void 0,privacyPolicyUrl:void 0}),v={state:y,subscribe:e=>d(y,(()=>e(y))),setConfig(e){var t,s;m.initialize(),b.setChains(e.chains),b.setIsAuth(Boolean(e.enableAuthMode)),b.setIsCustomMobile(Boolean(null==(t=e.mobileWallets)?void 0:t.length)),b.setIsCustomDesktop(Boolean(null==(s=e.desktopWallets)?void 0:s.length)),h.setModalVersionInStorage(),Object.assign(y,e)}};var w=Object.defineProperty,I=Object.getOwnPropertySymbols,C=Object.prototype.hasOwnProperty,W=Object.prototype.propertyIsEnumerable,O=(e,t,s)=>t in e?w(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;const E="https://explorer-api.walletconnect.com",j="wcm",L="js-2.6.2";async function A(e,t){const s=((e,t)=>{for(var s in t||(t={}))C.call(t,s)&&O(e,s,t[s]);if(I)for(var s of I(t))W.call(t,s)&&O(e,s,t[s]);return e})({sdkType:j,sdkVersion:L},t),o=new URL(e,E);return o.searchParams.append("projectId",v.state.projectId),Object.entries(s).forEach((([e,t])=>{t&&o.searchParams.append(e,String(t))})),(await fetch(o)).json()}const k={getDesktopListings:async e=>A("/w3m/v1/getDesktopListings",e),getMobileListings:async e=>A("/w3m/v1/getMobileListings",e),getInjectedListings:async e=>A("/w3m/v1/getInjectedListings",e),getAllListings:async e=>A("/w3m/v1/getAllListings",e),getWalletImageUrl:e=>`${E}/w3m/v1/getWalletImage/${e}?projectId=${v.state.projectId}&sdkType=${j}&sdkVersion=${L}`,getAssetImageUrl:e=>`${E}/w3m/v1/getAssetImage/${e}?projectId=${v.state.projectId}&sdkType=${j}&sdkVersion=${L}`};var M=Object.defineProperty,U=Object.getOwnPropertySymbols,D=Object.prototype.hasOwnProperty,P=Object.prototype.propertyIsEnumerable,S=(e,t,s)=>t in e?M(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;const N=h.isMobile(),T=c({wallets:{listings:[],total:0,page:1},search:{listings:[],total:0,page:1},recomendedWallets:[]}),x={state:T,async getRecomendedWallets(){const{explorerRecommendedWalletIds:e,explorerExcludedWalletIds:t}=v.state;if("NONE"===e||"ALL"===t&&!e)return T.recomendedWallets;if(h.isArray(e)){const t={recommendedIds:e.join(",")},{listings:s}=await k.getAllListings(t),o=Object.values(s);o.sort(((t,s)=>e.indexOf(t.id)-e.indexOf(s.id))),T.recomendedWallets=o}else{const{chains:e,isAuth:s}=b.state,o=e?.join(","),n=h.isArray(t),a={page:1,sdks:s?"auth_v1":void 0,entries:h.RECOMMENDED_WALLET_AMOUNT,chains:o,version:2,excludedIds:n?t.join(","):void 0},{listings:r}=N?await k.getMobileListings(a):await k.getDesktopListings(a);T.recomendedWallets=Object.values(r)}return T.recomendedWallets},async getWallets(e){const t=((e,t)=>{for(var s in t||(t={}))D.call(t,s)&&S(e,s,t[s]);if(U)for(var s of U(t))P.call(t,s)&&S(e,s,t[s]);return e})({},e),{explorerRecommendedWalletIds:s,explorerExcludedWalletIds:o}=v.state,{recomendedWallets:n}=T;if("ALL"===o)return T.wallets;n.length?t.excludedIds=n.map((e=>e.id)).join(","):h.isArray(s)&&(t.excludedIds=s.join(",")),h.isArray(o)&&(t.excludedIds=[t.excludedIds,o].filter(Boolean).join(",")),b.state.isAuth&&(t.sdks="auth_v1");const{page:a,search:r}=e,{listings:i,total:l}=N?await k.getMobileListings(t):await k.getDesktopListings(t),c=Object.values(i),d=r?"search":"wallets";return T[d]={listings:[...T[d].listings,...c],total:l,page:a??1},{listings:c,total:l}},getWalletImageUrl:e=>k.getWalletImageUrl(e),getAssetImageUrl:e=>k.getAssetImageUrl(e),resetSearch(){T.search={listings:[],total:0,page:1}}},R=c({open:!1}),_={state:R,subscribe:e=>d(R,(()=>e(R))),open:async e=>new Promise((t=>{const{isUiLoaded:s,isDataLoaded:o}=b.state;if(h.removeWalletConnectDeepLink(),b.setWalletConnectUri(e?.uri),b.setChains(e?.chains),u.reset("ConnectWallet"),s&&o)R.open=!0,t();else{const e=setInterval((()=>{const s=b.state;s.isUiLoaded&&s.isDataLoaded&&(clearInterval(e),R.open=!0,t())}),200)}})),close(){R.open=!1}};var $=Object.defineProperty,V=Object.getOwnPropertySymbols,B=Object.prototype.hasOwnProperty,H=Object.prototype.propertyIsEnumerable,K=(e,t,s)=>t in e?$(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;const z=c({themeMode:typeof matchMedia<"u"&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}),J={state:z,subscribe:e=>d(z,(()=>e(z))),setThemeConfig(e){const{themeMode:t,themeVariables:s}=e;t&&(z.themeMode=t),s&&(z.themeVariables=((e,t)=>{for(var s in t||(t={}))B.call(t,s)&&K(e,s,t[s]);if(V)for(var s of V(t))H.call(t,s)&&K(e,s,t[s]);return e})({},s))}},q=c({open:!1,message:"",variant:"success"}),F={state:q,subscribe:e=>d(q,(()=>e(q))),openToast(e,t){q.open=!0,q.message=e,q.variant=t},closeToast(){q.open=!1}}},9343:(e,t,s)=>{s.d(t,{WalletConnectModal:()=>n});var o=s(7998);class n{constructor(e){this.openModal=o.jb.open,this.closeModal=o.jb.close,this.subscribeModal=o.jb.subscribe,this.setTheme=o.ThemeCtrl.setThemeConfig,o.ThemeCtrl.setThemeConfig(e),o.ConfigCtrl.setConfig(e),this.initUi()}async initUi(){if(typeof window<"u"){await Promise.all([s.e(152),s.e(789)]).then(s.bind(s,1789));const e=document.createElement("wcm-modal");document.body.insertAdjacentElement("beforeend",e),o.OptionsCtrl.setIsUiLoaded(!0)}}}}}]);