/*! For license information please see main.00820c56.js.LICENSE.txt */
  :root,
  :host {
    --chakra-vh: 100vh;
  }

  @supports (height: -webkit-fill-available) {
    :root,
    :host {
      --chakra-vh: -webkit-fill-available;
    }
  }

  @supports (height: -moz-fill-available) {
    :root,
    :host {
      --chakra-vh: -moz-fill-available;
    }
  }

  @supports (height: 100dvh) {
    :root,
    :host {
      --chakra-vh: 100dvh;
    }
  }
`,ZT=()=>(0,a.jsx)(Jn,{styles:JT}),QT=e=>{let{scope:t=""}=e;return(0,a.jsx)(Jn,{styles:XT`
      html {
        line-height: 1.5;
        -webkit-text-size-adjust: 100%;
        font-family: system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        touch-action: manipulation;
      }

      body {
        position: relative;
        min-height: 100%;
        margin: 0;
        font-feature-settings: "kern";
      }

      ${t} :where(*, *::before, *::after) {
        border-width: 0;
        border-style: solid;
        box-sizing: border-box;
        word-wrap: break-word;
      }

      main {
        display: block;
      }

      ${t} hr {
        border-top-width: 1px;
        box-sizing: content-box;
        height: 0;
        overflow: visible;
      }

      ${t} :where(pre, code, kbd,samp) {
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 1em;
      }

      ${t} a {
        background-color: transparent;
        color: inherit;
        text-decoration: inherit;
      }

      ${t} abbr[title] {
        border-bottom: none;
        text-decoration: underline;
        -webkit-text-decoration: underline dotted;
        text-decoration: underline dotted;
      }

      ${t} :where(b, strong) {
        font-weight: bold;
      }

      ${t} small {
        font-size: 80%;
      }

      ${t} :where(sub,sup) {
        font-size: 75%;
        line-height: 0;
        position: relative;
        vertical-align: baseline;
      }

      ${t} sub {
        bottom: -0.25em;
      }

      ${t} sup {
        top: -0.5em;
      }

      ${t} img {
        border-style: none;
      }

      ${t} :where(button, input, optgroup, select, textarea) {
        font-family: inherit;
        font-size: 100%;
        line-height: 1.15;
        margin: 0;
      }

      ${t} :where(button, input) {
        overflow: visible;
      }

      ${t} :where(button, select) {
        text-transform: none;
      }

      ${t} :where(
          button::-moz-focus-inner,
          [type="button"]::-moz-focus-inner,
          [type="reset"]::-moz-focus-inner,
          [type="submit"]::-moz-focus-inner
        ) {
        border-style: none;
        padding: 0;
      }

      ${t} fieldset {
        padding: 0.35em 0.75em 0.625em;
      }

      ${t} legend {
        box-sizing: border-box;
        color: inherit;
        display: table;
        max-width: 100%;
        padding: 0;
        white-space: normal;
      }

      ${t} progress {
        vertical-align: baseline;
      }

      ${t} textarea {
        overflow: auto;
      }

      ${t} :where([type="checkbox"], [type="radio"]) {
        box-sizing: border-box;
        padding: 0;
      }

      ${t} input[type="number"]::-webkit-inner-spin-button,
      ${t} input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none !important;
      }

      ${t} input[type="number"] {
        -moz-appearance: textfield;
      }

      ${t} input[type="search"] {
        -webkit-appearance: textfield;
        outline-offset: -2px;
      }

      ${t} input[type="search"]::-webkit-search-decoration {
        -webkit-appearance: none !important;
      }

      ${t} ::-webkit-file-upload-button {
        -webkit-appearance: button;
        font: inherit;
      }

      ${t} details {
        display: block;
      }

      ${t} summary {
        display: list-item;
      }

      template {
        display: none;
      }

      [hidden] {
        display: none !important;
      }

      ${t} :where(
          blockquote,
          dl,
          dd,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          hr,
          figure,
          p,
          pre
        ) {
        margin: 0;
      }

      ${t} button {
        background: transparent;
        padding: 0;
      }

      ${t} fieldset {
        margin: 0;
        padding: 0;
      }

      ${t} :where(ol, ul) {
        margin: 0;
        padding: 0;
      }

      ${t} textarea {
        resize: vertical;
      }

      ${t} :where(button, [role="button"]) {
        cursor: pointer;
      }

      ${t} button::-moz-focus-inner {
        border: 0 !important;
      }

      ${t} table {
        border-collapse: collapse;
      }

      ${t} :where(h1, h2, h3, h4, h5, h6) {
        font-size: inherit;
        font-weight: inherit;
      }

      ${t} :where(button, input, optgroup, select, textarea) {
        padding: 0;
        line-height: inherit;
        color: inherit;
      }

      ${t} :where(img, svg, video, canvas, audio, iframe, embed, object) {
        display: block;
      }

      ${t} :where(img, video) {
        max-width: 100%;
        height: auto;
      }

      [data-js-focus-visible]
        :focus:not([data-focus-visible-added]):not(
          [data-focus-visible-disabled]
        ) {
        outline: none;
        box-shadow: none;
      }

      ${t} select::-ms-expand {
        display: none;
      }

      ${JT}
    `})};function eM(e,t){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};const{stop:n,getKey:i}=r;return function e(r){let o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];if(d(r)||Array.isArray(r)){const a={};for(const[s,l]of Object.entries(r)){const c=i?.(s)??s,u=[...o,c];if(n?.(r,u))return t(r,o);a[c]=e(l,u)}return a}return t(r,o)}(e)}const tM=["colors","borders","borderWidths","borderStyles","fonts","fontSizes","fontWeights","gradients","letterSpacings","lineHeights","radii","space","shadows","sizes","zIndices","transition","blur","breakpoints"];function rM(e){return Lv(e,tM)}function nM(e,t){return jw(String(e).replace(/\./g,"-"),void 0,t)}function iM(e){const t=function(e){const t=rM(e),r=function(e){return e.semanticTokens}(e),n=e=>xt.includes(e)||"default"===e,i={};return eM(t,((e,t)=>{null!=e&&(i[t.join(".")]={isSemantic:!1,value:e})})),eM(r,((e,t)=>{null!=e&&(i[t.join(".")]={isSemantic:!0,value:e})}),{stop:e=>Object.keys(e).every(n)}),i}(e),r=e.config?.cssVarPrefix;let n={};const i={};function o(e,n){const i=[String(e).split(".")[0],n].join(".");if(!t[i])return n;const{reference:o}=nM(i,r);return o}for(const[a,s]of Object.entries(t)){const{isSemantic:e,value:t}=s,{variable:l,reference:c}=nM(a,r);if(!e){if(a.startsWith("space")){const e=a.split("."),[r,...n]=e,o=`${r}.-${n.join(".")}`,s=uA.negate(t),u=uA.negate(c);i[o]={value:s,var:l,varRef:u}}n[l]=t,i[a]={value:t,var:l,varRef:c};continue}const u=d(t)?t:{default:t};n=S(n,Object.entries(u).reduce(((e,t)=>{let[r,n]=t;if(!n)return e;const i=o(a,`${n}`);if("default"===r)return e[l]=i,e;return e[bt?.[r]??r]={[l]:i},e}),{})),i[a]={value:c,var:l,varRef:c}}return{cssVars:n,cssMap:i}}function oM(e){const{cssVarsRoot:t,theme:n,children:i}=e,o=(0,r.useMemo)((()=>function(e){const t=function(e){const{__cssMap:t,__cssVars:r,__breakpoints:n,...i}=e;return i}(e),{cssMap:r,cssVars:n}=iM(t);return Object.assign(t,{__cssVars:{"--chakra-ring-inset":"var(--chakra-empty,/*!*/ /*!*/)","--chakra-ring-offset-width":"0px","--chakra-ring-offset-color":"#fff","--chakra-ring-color":"rgba(66, 153, 225, 0.6)","--chakra-ring-offset-shadow":"0 0 #0000","--chakra-ring-shadow":"0 0 #0000","--chakra-space-x-reverse":"0","--chakra-space-y-reverse":"0",...n},__cssMap:r,__breakpoints:x(t.breakpoints)}),t}(n)),[n]);return(0,a.jsxs)(Je,{theme:o,children:[(0,a.jsx)(aM,{root:t}),i]})}function aM(e){let{root:t=":host, :root"}=e;const r=[t,"[data-theme]"].join(",");return(0,a.jsx)(Jn,{styles:e=>({[r]:e.__cssVars})})}const[sM,lM]=jr({name:"StylesContext",errorMessage:"useStyles: `styles` is undefined. Seems you forgot to wrap the components in `<StylesProvider />` "});function cM(){const{colorMode:e}=et();return(0,a.jsx)(Jn,{styles:t=>{const r=w(_(t,"styles.global"),{theme:t,colorMode:e});if(!r)return;return mr(r)(t)}})}const uM=(0,r.createContext)({getDocument:()=>document,getWindow:()=>window});function hM(e){const{children:t,environment:n,disabled:i}=e,o=(0,r.useRef)(null),s=(0,r.useMemo)((()=>n||{getDocument:()=>o.current?.ownerDocument??document,getWindow:()=>o.current?.ownerDocument.defaultView??window}),[n]),l=!i||!n;return(0,a.jsxs)(uM.Provider,{value:s,children:[t,l&&(0,a.jsx)("span",{id:"__chakra_env",hidden:!0,ref:o})]})}uM.displayName="EnvironmentContext",hM.displayName="EnvironmentProvider";const dM=e=>{const{children:t,colorModeManager:r,portalZIndex:n,resetScope:i,resetCSS:o=!0,theme:s={},environment:l,cssVarsRoot:c,disableEnvironment:u,disableGlobalStyle:h}=e,d=(0,a.jsx)(hM,{environment:l,disabled:u,children:t});return(0,a.jsx)(oM,{theme:s,cssVarsRoot:c,children:(0,a.jsxs)(KT,{colorModeManager:r,options:s.config,children:[o?(0,a.jsx)(QT,{scope:i}):(0,a.jsx)(ZT,{}),!h&&(0,a.jsx)(cM,{}),n?(0,a.jsx)(gd,{zIndex:n,children:d}):d]})})},pM=(fM=LT,function(e){let{children:t,theme:r=fM,toastOptions:n,...i}=e;return(0,a.jsxs)(dM,{theme:r,...i,children:[(0,a.jsx)(Ed,{value:n?.defaultOptions,children:t}),(0,a.jsx)(Cd,{...n})]})});var fM,mM=__webpack_require__(321),gM=__webpack_require__(404),yM=function(e){function t(){for(var t,r=arguments.length,n=new Array(r),i=0;i<r;i++)n[i]=arguments[i];return(t=e.call.apply(e,[this].concat(n))||this).history=(0,mM.createBrowserHistory)(t.props),t}return(0,bg.A)(t,e),t.prototype.render=function(){return r.createElement(o.Router,{history:this.history,children:this.props.children})},t}(r.Component);r.Component;var vM=function(e,t){return"function"===typeof e?e(t):e},bM=function(e,t){return"string"===typeof e?(0,mM.createLocation)(e,null,null,t):e},xM=function(e){return e},wM=r.forwardRef;"undefined"===typeof wM&&(wM=xM);var SM=wM((function(e,t){var n=e.innerRef,i=e.navigate,o=e.onClick,a=(0,ag.A)(e,["innerRef","navigate","onClick"]),s=a.target,l=(0,Me.A)({},a,{onClick:function(e){try{o&&o(e)}catch(t){throw e.preventDefault(),t}e.defaultPrevented||0!==e.button||s&&"_self"!==s||function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}(e)||(e.preventDefault(),i())}});return l.ref=xM!==wM&&t||n,r.createElement("a",l)}));var kM=wM((function(e,t){var n=e.component,i=void 0===n?SM:n,a=e.replace,s=e.to,l=e.innerRef,c=(0,ag.A)(e,["component","replace","to","innerRef"]);return r.createElement(o.__RouterContext.Consumer,null,(function(e){e||(0,gM.A)(!1);var n=e.history,o=bM(vM(s,e.location),e.location),u=o?n.createHref(o):"",h=(0,Me.A)({},c,{href:u,navigate:function(){var t=vM(s,e.location),r=(0,mM.createPath)(e.location)===(0,mM.createPath)(bM(t));(a||r?n.replace:n.push)(t)}});return xM!==wM?h.ref=t||l:h.innerRef=l,r.createElement(i,h)}))})),EM=function(e){return e},_M=r.forwardRef;"undefined"===typeof _M&&(_M=EM);_M((function(e,t){var n=e["aria-current"],i=void 0===n?"page":n,a=e.activeClassName,s=void 0===a?"active":a,l=e.activeStyle,c=e.className,u=e.exact,h=e.isActive,d=e.location,p=e.sensitive,f=e.strict,m=e.style,g=e.to,y=e.innerRef,v=(0,ag.A)(e,["aria-current","activeClassName","activeStyle","className","exact","isActive","location","sensitive","strict","style","to","innerRef"]);return r.createElement(o.__RouterContext.Consumer,null,(function(e){e||(0,gM.A)(!1);var n=d||e.location,a=bM(vM(g,n),n),b=a.pathname,x=b&&b.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1"),w=x?(0,o.matchPath)(n.pathname,{path:x,exact:u,sensitive:p,strict:f}):null,S=!!(h?h(w,n):w),k="function"===typeof c?c(S):c,E="function"===typeof m?m(S):m;S&&(k=function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return t.filter((function(e){return e})).join(" ")}(k,s),E=(0,Me.A)({},E,l));var _=(0,Me.A)({"aria-current":S&&i||null,className:k,style:E,to:a},v);return EM!==_M?_.ref=t||y:_.innerRef=y,r.createElement(kM,_)}))}));i.createRoot(document.getElementById("root")).render((0,a.jsx)(yM,{children:(0,a.jsx)(jv,{children:(0,a.jsx)(pM,{children:(0,a.jsx)(Lk,{})})})}))})()})();
//# sourceMappingURL=main.00820c56.js.map