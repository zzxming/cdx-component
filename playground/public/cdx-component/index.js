import {
    ref,
    computed,
    getCurrentInstance,
    watch,
    isRef,
    onScopeDispose,
    onMounted,
    onBeforeUnmount,
    defineComponent,
    useSlots,
    nextTick,
    openBlock,
    createElementBlock,
    normalizeClass as normalizeClass$1,
    unref,
    renderSlot,
    createCommentVNode,
    createBlock,
    Teleport,
    createVNode,
    Transition,
    withCtx,
    createElementVNode,
    mergeProps,
    toHandlers,
    withDirectives,
    vShow,
    provide,
    toRefs,
    resolveDynamicComponent,
    inject,
    withModifiers,
    vModelCheckbox,
    normalizeStyle as normalizeStyle$1,
    toDisplayString as toDisplayString$1,
    reactive,
    h,
    createApp,
    createTextVNode,
    Fragment,
    renderList,
    toHandlerKey as toHandlerKey$1,
} from 'vue';
const cacheFunction = (func) => {
    let result;
    return function () {
        if (typeof result === 'undefined') {
            result = func();
        }
        return result;
    };
};
/**
 * @vue/shared v3.4.15
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/
function makeMap(str, expectsLowerCase) {
    const set = new Set(str.split(','));
    return expectsLowerCase ? (val) => set.has(val.toLowerCase()) : (val) => set.has(val);
}
const EMPTY_OBJ = false ? Object.freeze({}) : {};
const EMPTY_ARR = false ? Object.freeze([]) : [];
const NOOP = () => {};
const NO = () => false;
const isOn = (key) =>
    key.charCodeAt(0) === 111 &&
    key.charCodeAt(1) === 110 && // uppercase letter
    (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith('onUpdate:');
const extend = Object.assign;
const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
        arr.splice(i, 1);
    }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === '[object Map]';
const isSet = (val) => toTypeString(val) === '[object Set]';
const isDate = (val) => toTypeString(val) === '[object Date]';
const isRegExp = (val) => toTypeString(val) === '[object RegExp]';
const isFunction = (val) => typeof val === 'function';
const isString = (val) => typeof val === 'string';
const isSymbol = (val) => typeof val === 'symbol';
const isObject = (val) => val !== null && typeof val === 'object';
const isPromise = (val) => {
    return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === '[object Object]';
const isIntegerKey = (key) => isString(key) && key !== 'NaN' && key[0] !== '-' && '' + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
    // the leading comma is intentional so empty string "" is also included
    ',key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted',
);
const isBuiltInDirective = /* @__PURE__ */ makeMap(
    'bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo',
);
const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, '-$1').toLowerCase());
const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
    const s = str ? `on${capitalize(str)}` : ``;
    return s;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
    for (let i = 0; i < fns.length; i++) {
        fns[i](arg);
    }
};
const def = (obj, key, value) => {
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: false,
        value,
    });
};
const looseToNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
};
const toNumber = (val) => {
    const n = isString(val) ? Number(val) : NaN;
    return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
    return (
        _globalThis ||
        (_globalThis =
            typeof globalThis !== 'undefined'
                ? globalThis
                : typeof self !== 'undefined'
                  ? self
                  : typeof window !== 'undefined'
                    ? window
                    : typeof global !== 'undefined'
                      ? global
                      : {})
    );
};
const identRE = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
function genPropsAccessExp(name) {
    return identRE.test(name) ? `__props.${name}` : `__props[${JSON.stringify(name)}]`;
}
const PatchFlags = {
    TEXT: 1,
    1: 'TEXT',
    CLASS: 2,
    2: 'CLASS',
    STYLE: 4,
    4: 'STYLE',
    PROPS: 8,
    8: 'PROPS',
    FULL_PROPS: 16,
    16: 'FULL_PROPS',
    NEED_HYDRATION: 32,
    32: 'NEED_HYDRATION',
    STABLE_FRAGMENT: 64,
    64: 'STABLE_FRAGMENT',
    KEYED_FRAGMENT: 128,
    128: 'KEYED_FRAGMENT',
    UNKEYED_FRAGMENT: 256,
    256: 'UNKEYED_FRAGMENT',
    NEED_PATCH: 512,
    512: 'NEED_PATCH',
    DYNAMIC_SLOTS: 1024,
    1024: 'DYNAMIC_SLOTS',
    DEV_ROOT_FRAGMENT: 2048,
    2048: 'DEV_ROOT_FRAGMENT',
    HOISTED: -1,
    '-1': 'HOISTED',
    BAIL: -2,
    '-2': 'BAIL',
};
const PatchFlagNames = {
    [1]: `TEXT`,
    [2]: `CLASS`,
    [4]: `STYLE`,
    [8]: `PROPS`,
    [16]: `FULL_PROPS`,
    [32]: `NEED_HYDRATION`,
    [64]: `STABLE_FRAGMENT`,
    [128]: `KEYED_FRAGMENT`,
    [256]: `UNKEYED_FRAGMENT`,
    [512]: `NEED_PATCH`,
    [1024]: `DYNAMIC_SLOTS`,
    [2048]: `DEV_ROOT_FRAGMENT`,
    [-1]: `HOISTED`,
    [-2]: `BAIL`,
};
const ShapeFlags = {
    ELEMENT: 1,
    1: 'ELEMENT',
    FUNCTIONAL_COMPONENT: 2,
    2: 'FUNCTIONAL_COMPONENT',
    STATEFUL_COMPONENT: 4,
    4: 'STATEFUL_COMPONENT',
    TEXT_CHILDREN: 8,
    8: 'TEXT_CHILDREN',
    ARRAY_CHILDREN: 16,
    16: 'ARRAY_CHILDREN',
    SLOTS_CHILDREN: 32,
    32: 'SLOTS_CHILDREN',
    TELEPORT: 64,
    64: 'TELEPORT',
    SUSPENSE: 128,
    128: 'SUSPENSE',
    COMPONENT_SHOULD_KEEP_ALIVE: 256,
    256: 'COMPONENT_SHOULD_KEEP_ALIVE',
    COMPONENT_KEPT_ALIVE: 512,
    512: 'COMPONENT_KEPT_ALIVE',
    COMPONENT: 6,
    6: 'COMPONENT',
};
const SlotFlags = {
    STABLE: 1,
    1: 'STABLE',
    DYNAMIC: 2,
    2: 'DYNAMIC',
    FORWARDED: 3,
    3: 'FORWARDED',
};
const slotFlagsText = {
    [1]: 'STABLE',
    [2]: 'DYNAMIC',
    [3]: 'FORWARDED',
};
const GLOBALS_ALLOWED =
    'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error';
const isGloballyAllowed = /* @__PURE__ */ makeMap(GLOBALS_ALLOWED);
const isGloballyWhitelisted = isGloballyAllowed;
const range = 2;
function generateCodeFrame(source, start = 0, end = source.length) {
    let lines = source.split(/(\r?\n)/);
    const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
    lines = lines.filter((_, idx) => idx % 2 === 0);
    let count = 0;
    const res = [];
    for (let i = 0; i < lines.length; i++) {
        count += lines[i].length + ((newlineSequences[i] && newlineSequences[i].length) || 0);
        if (count >= start) {
            for (let j = i - range; j <= i + range || end > count; j++) {
                if (j < 0 || j >= lines.length) continue;
                const line = j + 1;
                res.push(`${line}${' '.repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
                const lineLength = lines[j].length;
                const newLineSeqLength = (newlineSequences[j] && newlineSequences[j].length) || 0;
                if (j === i) {
                    const pad = start - (count - (lineLength + newLineSeqLength));
                    const length = Math.max(1, end > count ? lineLength - pad : end - start);
                    res.push(`   |  ` + ' '.repeat(pad) + '^'.repeat(length));
                } else if (j > i) {
                    if (end > count) {
                        const length = Math.max(Math.min(end - count, lineLength), 1);
                        res.push(`   |  ` + '^'.repeat(length));
                    }
                    count += lineLength + newLineSeqLength;
                }
            }
            break;
        }
    }
    return res.join('\n');
}
function normalizeStyle(value) {
    if (isArray(value)) {
        const res = {};
        for (let i = 0; i < value.length; i++) {
            const item = value[i];
            const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
            if (normalized) {
                for (const key in normalized) {
                    res[key] = normalized[key];
                }
            }
        }
        return res;
    } else if (isString(value) || isObject(value)) {
        return value;
    }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
    const ret = {};
    cssText
        .replace(styleCommentRE, '')
        .split(listDelimiterRE)
        .forEach((item) => {
            if (item) {
                const tmp = item.split(propertyDelimiterRE);
                tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
            }
        });
    return ret;
}
function stringifyStyle(styles) {
    let ret = '';
    if (!styles || isString(styles)) {
        return ret;
    }
    for (const key in styles) {
        const value = styles[key];
        const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
        if (isString(value) || typeof value === 'number') {
            ret += `${normalizedKey}:${value};`;
        }
    }
    return ret;
}
function normalizeClass(value) {
    let res = '';
    if (isString(value)) {
        res = value;
    } else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            const normalized = normalizeClass(value[i]);
            if (normalized) {
                res += normalized + ' ';
            }
        }
    } else if (isObject(value)) {
        for (const name in value) {
            if (value[name]) {
                res += name + ' ';
            }
        }
    }
    return res.trim();
}
function normalizeProps(props) {
    if (!props) return null;
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
    }
    if (style) {
        props.style = normalizeStyle(style);
    }
    return props;
}
const HTML_TAGS =
    'html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot';
const SVG_TAGS =
    'svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view';
const MATH_TAGS =
    'annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics';
const VOID_TAGS = 'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr';
const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
const isMathMLTag = /* @__PURE__ */ makeMap(MATH_TAGS);
const isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
const isBooleanAttr = /* @__PURE__ */ makeMap(
    specialBooleanAttrs +
        `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`,
);
function includeBooleanAttr(value) {
    return !!value || value === '';
}
const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
const attrValidationCache = {};
function isSSRSafeAttrName(name) {
    if (attrValidationCache.hasOwnProperty(name)) {
        return attrValidationCache[name];
    }
    const isUnsafe = unsafeAttrCharRE.test(name);
    if (isUnsafe) {
        console.error(`unsafe attribute name: ${name}`);
    }
    return (attrValidationCache[name] = !isUnsafe);
}
const propsToAttrMap = {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv',
};
const isKnownHtmlAttr = /* @__PURE__ */ makeMap(
    `accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,inert,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`,
);
const isKnownSvgAttr = /* @__PURE__ */ makeMap(
    `xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xmlns:xlink,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`,
);
function isRenderableAttrValue(value) {
    if (value == null) {
        return false;
    }
    const type = typeof value;
    return type === 'string' || type === 'number' || type === 'boolean';
}
const escapeRE = /["'&<>]/;
function escapeHtml(string) {
    const str = '' + string;
    const match = escapeRE.exec(str);
    if (!match) {
        return str;
    }
    let html = '';
    let escaped;
    let index;
    let lastIndex = 0;
    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34:
                escaped = '&quot;';
                break;
            case 38:
                escaped = '&amp;';
                break;
            case 39:
                escaped = '&#39;';
                break;
            case 60:
                escaped = '&lt;';
                break;
            case 62:
                escaped = '&gt;';
                break;
            default:
                continue;
        }
        if (lastIndex !== index) {
            html += str.slice(lastIndex, index);
        }
        lastIndex = index + 1;
        html += escaped;
    }
    return lastIndex !== index ? html + str.slice(lastIndex, index) : html;
}
const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
function escapeHtmlComment(src) {
    return src.replace(commentStripRE, '');
}
function looseCompareArrays(a, b) {
    if (a.length !== b.length) return false;
    let equal = true;
    for (let i = 0; equal && i < a.length; i++) {
        equal = looseEqual(a[i], b[i]);
    }
    return equal;
}
function looseEqual(a, b) {
    if (a === b) return true;
    let aValidType = isDate(a);
    let bValidType = isDate(b);
    if (aValidType || bValidType) {
        return aValidType && bValidType ? a.getTime() === b.getTime() : false;
    }
    aValidType = isSymbol(a);
    bValidType = isSymbol(b);
    if (aValidType || bValidType) {
        return a === b;
    }
    aValidType = isArray(a);
    bValidType = isArray(b);
    if (aValidType || bValidType) {
        return aValidType && bValidType ? looseCompareArrays(a, b) : false;
    }
    aValidType = isObject(a);
    bValidType = isObject(b);
    if (aValidType || bValidType) {
        if (!aValidType || !bValidType) {
            return false;
        }
        const aKeysCount = Object.keys(a).length;
        const bKeysCount = Object.keys(b).length;
        if (aKeysCount !== bKeysCount) {
            return false;
        }
        for (const key in a) {
            const aHasKey = a.hasOwnProperty(key);
            const bHasKey = b.hasOwnProperty(key);
            if ((aHasKey && !bHasKey) || (!aHasKey && bHasKey) || !looseEqual(a[key], b[key])) {
                return false;
            }
        }
    }
    return String(a) === String(b);
}
function looseIndexOf(arr, val) {
    return arr.findIndex((item) => looseEqual(item, val));
}
const toDisplayString = (val) => {
    return isString(val)
        ? val
        : val == null
          ? ''
          : isArray(val) || (isObject(val) && (val.toString === objectToString || !isFunction(val.toString)))
            ? JSON.stringify(val, replacer, 2)
            : String(val);
};
const replacer = (_key, val) => {
    if (val && val.__v_isRef) {
        return replacer(_key, val.value);
    } else if (isMap(val)) {
        return {
            [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2], i) => {
                entries[stringifySymbol(key, i) + ' =>'] = val2;
                return entries;
            }, {}),
        };
    } else if (isSet(val)) {
        return {
            [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v)),
        };
    } else if (isSymbol(val)) {
        return stringifySymbol(val);
    } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
        return String(val);
    }
    return val;
};
const stringifySymbol = (v, i = '') => {
    var _a;
    return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
};
const isUndefined = (val) => val === void 0;
const isBoolean = (val) => typeof val === 'boolean';
const isNumber = (val) => typeof val === 'number';
const withInstall = (main, extra) => {
    main.install = (app) => {
        for (const comp of [main, ...Object.values(extra != null ? extra : {})]) {
            app.component(comp.name, comp);
        }
    };
    if (extra) {
        for (const [key, comp] of Object.entries(extra)) {
            main[key] = comp;
        }
    }
    return main;
};
const withInstallDirective = (directive, name) => {
    directive.install = (app) => {
        app.directive(name, directive);
    };
    return directive;
};
const PropKey = '__propKey';
const definePropType = (val) => val;
const buildProp = (prop) => {
    if (!isObject(prop)) return prop;
    const { type, required, default: defaultValue, values, validator } = prop;
    const _validator =
        values || validator
            ? (val) => {
                  let valid = false;
                  let allowValues = [];
                  if (values) {
                      allowValues = Array.from(values);
                      if (defaultValue) allowValues.push(defaultValue);
                      valid = allowValues.includes(val);
                  }
                  if (validator) valid = validator(val);
                  return valid;
              }
            : void 0;
    const resultProp = {
        type,
        required: !!required,
        validator: _validator,
        [PropKey]: true,
    };
    if (!isUndefined(defaultValue)) resultProp.default = defaultValue;
    return resultProp;
};
const buildProps = (props) =>
    Object.entries(props).reduce((acc, [k, v]) => {
        acc[k] = buildProp(v);
        return acc;
    }, {});
const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const color = `rgb(${r}, ${g}, ${b})`;
    return color;
};
const createBEM = (n, b) => ({
    b: () => `${n}-${b}`,
    be: (e) => `${n}-${b}__${e}`,
    bm: (m) => `${n}-${b}--${m}`,
    bem: (e, m) => `${n}-${b}__${e}--${m}`,
    ns: (s) => `${n}-${s}`,
    bs: (s) => `${n}-${b}-${s}`,
    cv: (v) => `--${n}-${v}`,
});
const createNamespace = (namespace2, name) => {
    const preName = `${namespace2}-${name}`;
    return [preName, createBEM(namespace2, name)];
};
let scrollBarWidth;
const getScrollBarWidth = (namespace2, { target = document.body } = {}) => {
    var _a;
    if (scrollBarWidth !== void 0) return scrollBarWidth;
    const outer = document.createElement('div');
    outer.className = `${namespace2}-scrollbar__wrap`;
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.position = 'absolute';
    outer.style.top = '-9999px';
    target.appendChild(outer);
    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';
    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);
    const widthWithScroll = inner.offsetWidth;
    (_a = outer.parentNode) == null ? void 0 : _a.removeChild(outer);
    scrollBarWidth = widthNoScroll - widthWithScroll;
    return scrollBarWidth;
};
const isServer = typeof window === 'undefined';
const raf = (fn) => {
    if (isServer) {
        let lastTime = 0;
        const currTime = /* @__PURE__ */ new Date().getTime();
        const timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
        return setTimeout(() => {
            fn(currTime + timeToCall);
            lastTime = currTime + timeToCall;
        }, timeToCall);
    } else {
        return window.requestAnimationFrame(fn);
    }
};
const caf = (id) => (isServer ? clearTimeout(id) : window.cancelAnimationFrame(id));
const getIntegerLength = (num) => String(precisionNumber(num)).split('.')[0].length - (num < 0 ? 1 : 0);
const precisionNumber = (num) => Number(parseFloat(num.toString()).toPrecision(16));
const getDecimalLength = (n) => {
    const [num, eNum] = n.toString().split('e');
    const [, decimal] = num.split('.');
    if (eNum) {
        const e = Number(eNum);
        return e * -1 + (decimal || '').length;
    }
    return (decimal || '').length;
};
const toStringNumber = (n) => {
    const strNum = n.toString();
    if (strNum.indexOf('e') === -1) return strNum;
    const [num, eNum] = strNum.split('e');
    const [, decimal] = num.split('.');
    const e = Number(eNum);
    const zeroCount = e > 0 ? Math.max(0, e - (decimal || '').length) : Math.abs(e) - 1;
    const strZero = '0'.repeat(zeroCount);
    if (e < 0) {
        return '0.' + strZero + num.replace('.', '');
    }
    return num.replace('.', '') + strZero;
};
const toFixed = (n, decimalCount) => {
    if (decimalCount < 0) throw new Error('argument decimalCount must be greater than or equal to 0');
    let [integer, decimal] = toStringNumber(n).toString().split('.');
    if (!decimal) decimal = '';
    if (decimal.length < decimalCount) decimal += '0'.repeat(decimalCount - decimal.length);
    let saveDeciaml = decimal.slice(0, decimalCount);
    if (Number(decimal[decimalCount]) > 4 && saveDeciaml.length) {
        saveDeciaml = (Number(saveDeciaml) + 1).toString();
    }
    return Number(`${integer}${saveDeciaml.length ? `.${saveDeciaml}` : ''}`);
};
const pick = (obj, names) => {
    const t = {};
    for (let i = 0; i < names.length; i++) {
        t[names[i]] = obj[names[i]];
    }
    return t;
};
const ensureArray = (value) => (Array.isArray(value) ? (value ? value : []) : [value]);
const INSTALLED_KEY = Symbol('installed');
const UPDATE_MODEL_EVENT = 'update:modelValue';
const CHANGE_EVENT = 'change';
const namespace = 'cdx';
const drawerProps = buildProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    direction: {
        type: String,
        values: ['left', 'right', 'top', 'bottom'],
        default: 'left',
    },
    fullscreen: {
        type: Boolean,
        default: false,
    },
    slide: {
        type: Boolean,
        default: true,
    },
    clickModelCose: {
        type: Boolean,
        default: true,
    },
    breakBoundary: {
        type: Number,
        default: 16,
    },
    size: {
        type: [Number, String],
        default: '68%',
    },
    bodySlide: {
        type: Boolean,
        default: true,
    },
});
const drawerEmits = {
    [UPDATE_MODEL_EVENT]: (value) => isBoolean(value),
};
const zIndex = ref(1e3);
const useZIndex = () => {
    const currentZIndex = computed(() => zIndex.value);
    const nextZIndex = () => {
        zIndex.value += 1;
        return currentZIndex.value;
    };
    return {
        currentZIndex,
        nextZIndex,
    };
};
const useBem = (block) => {
    return createNamespace(namespace, block);
};
const useSameClickTarget = (callback) => {
    let mouseDownTarget = false;
    let mouseUpTarget = false;
    let mouseDownTime = 0;
    let mousUpTime = 0;
    const onMouseDown = (e) => {
        mouseDownTarget = e.currentTarget === e.target;
        mouseDownTime = Date.now();
    };
    const onMouseUp = (e) => {
        mouseUpTarget = e.currentTarget === e.target;
        mousUpTime = Date.now();
    };
    const onClick = (e) => {
        if (mouseDownTarget && mouseUpTarget && mousUpTime - mouseDownTime < 200) {
            callback(e);
        }
        e.stopPropagation();
        mouseDownTarget = mouseUpTarget = false;
    };
    return {
        onMouseDown,
        onMouseUp,
        onClick,
    };
};
const useModelValue = (props, defaultValue) => {
    const { emit } = getCurrentInstance();
    const visible = ref(defaultValue);
    const model = computed({
        get() {
            return props.modelValue || visible.value;
        },
        set(value) {
            visible.value = value;
            emit(UPDATE_MODEL_EVENT, value);
        },
    });
    watch(
        () => props.modelValue,
        (val) => {
            model.value = val;
        },
        { immediate: true },
    );
    return { model };
};
const useLockScroll = (trigger, { target = document.body } = {}) => {
    if (!isRef(trigger)) {
        throw new Error('[useLockScroll]: You need to pass a ref param to this function');
    }
    const [, bem] = useBem('scroll');
    const clockClass = bem.bm('lock');
    const cleanLock = () => {
        target && (target.style.width = originWidth);
        target.classList.remove(clockClass);
    };
    let scrollBarWidth2 = 0;
    let originWidth = '0';
    watch(
        trigger,
        (value) => {
            const hasHiddenClass = target.classList.contains(clockClass);
            if (!hasHiddenClass) {
                originWidth = target.style.width;
            }
            scrollBarWidth2 = getScrollBarWidth(namespace, { target });
            const hasOverflow =
                (target === document.body ? document.documentElement : target).clientHeight < target.scrollHeight;
            const overflowY = getComputedStyle(target).overflowY;
            if (!value) {
                return cleanLock();
            }
            if (scrollBarWidth2 > 0 && (hasOverflow || overflowY === 'scroll') && !hasHiddenClass) {
                target.style.width = `calc(100% - ${scrollBarWidth2}px)`;
            }
            target.classList.add(clockClass);
        },
        { immediate: true, flush: 'post' },
    );
    onScopeDispose(() => cleanLock());
};
const supportsTouchDetector = cacheFunction(() => 'ontouchstart' in window);
const useSupportTouch = () => {
    const isSupportTouch = ref(false);
    const events = ref({
        down: 'mousedown',
        move: 'mousemove',
        up: 'mouseup',
    });
    onMounted(() => {
        isSupportTouch.value = supportsTouchDetector();
        if (isSupportTouch.value) {
            events.value = {
                down: 'touchstart',
                move: 'touchmove',
                up: 'touchend',
            };
        }
    });
    return {
        isSupportTouch,
        events,
    };
};
const useSlide = (target, options) => {
    const { eventOptions = {}, start, move, end } = options || {};
    const { isSupportTouch, events } = useSupportTouch();
    let startPosition = [0, 0];
    const direction = ref([false, false, false, false]);
    const eventBindOptions = computed(() => ({
        ...eventOptions,
        passive: false,
    }));
    const defineEvent = (e) => {
        const touchEvent = e;
        const mouseEvent = e;
        const moveToX = isSupportTouch.value ? touchEvent.changedTouches[0].clientX : mouseEvent.clientX;
        const moveToY = isSupportTouch.value ? touchEvent.changedTouches[0].clientY : mouseEvent.clientY;
        return {
            x: moveToX,
            y: moveToY,
        };
    };
    const bindEvent = () => {
        if (!target.value) return;
        unbindEvent();
        target.value.addEventListener(events.value.down, startSlide, eventBindOptions.value);
    };
    const clearDirection = () => {
        direction.value.forEach((_, i) => (direction.value[i] = false));
    };
    const unbindEvent = () => {
        if (!target.value) return;
        target.value.removeEventListener(events.value.down, startSlide);
        document.removeEventListener(events.value.move, moveSlide);
        document.removeEventListener(events.value.up, endSlide);
    };
    const startSlide = (e) => {
        e.preventDefault();
        const { x, y } = defineEvent(e);
        clearDirection();
        startPosition = [x, y];
        document.addEventListener(events.value.move, moveSlide, eventBindOptions.value);
        document.addEventListener(events.value.up, endSlide, eventBindOptions.value);
        start && start(e, { clientX: x, clientY: y });
    };
    const moveSlide = (e) => {
        e.preventDefault();
        const [x1, y1] = startPosition;
        const { x: x2, y: y2 } = defineEvent(e);
        const diffX = x2 - x1;
        const diffY = y2 - y1;
        if (diffX < 0) {
            direction.value[1] = false;
            direction.value[3] = true;
        } else if (diffX > 0) {
            direction.value[1] = true;
            direction.value[3] = false;
        } else {
            direction.value[1] = false;
            direction.value[3] = false;
        }
        if (diffY < 0) {
            direction.value[0] = true;
            direction.value[2] = false;
        } else if (diffY > 0) {
            direction.value[0] = false;
            direction.value[2] = true;
        } else {
            direction.value[0] = false;
            direction.value[2] = false;
        }
        move && move(e, { clientX: x2, clientY: y2, diffX, diffY });
    };
    const endSlide = (e) => {
        e.preventDefault();
        const { x, y } = defineEvent(e);
        document.removeEventListener(events.value.move, moveSlide);
        document.removeEventListener(events.value.up, endSlide);
        end &&
            end(e, {
                clientX: x,
                clientY: y,
                diffX: x - startPosition[0],
                diffY: y - startPosition[1],
            });
        startPosition = [0, 0];
        clearDirection();
    };
    onMounted(() => {
        bindEvent();
    });
    onBeforeUnmount(() => {
        unbindEvent();
    });
    return {
        direction,
        unbindEvent,
    };
};
const _hoisted_1$4 = ['direction'];
const _sfc_main$e = /* @__PURE__ */ defineComponent({
    ...{ name: 'CdxDrawer' },
    __name: 'drawer',
    props: drawerProps,
    emits: drawerEmits,
    setup(__props, { emit: __emit }) {
        const props = __props;
        const emits = __emit;
        const slots = useSlots();
        const [, bem] = useBem('drawer');
        const { model } = useModelValue(props, false);
        const { events: handledEvents } = useSupportTouch();
        let isOpening = false;
        let bodySize = 0;
        const drawerContentRect = ref();
        const drawerSwipeRef = ref();
        const drawerBodyRef = ref();
        const drawerBodyTransform = ref();
        const drawerBodyTransition = ref(false);
        const slidRef = ref();
        const { direction: slideDirection } = useSlide(slidRef, {
            start: () => {
                if (!canSlide.value) return;
                drawerContentRect.value = drawerSwipeRef.value.getBoundingClientRect();
                drawerBodyTransition.value = false;
                isOpening = !model.value;
            },
            move: async (_, { diffX, diffY }) => {
                if (!canSlide.value || !drawerBodyRef.value) return;
                const diff = isHorizontal.value ? diffX : diffY;
                if (
                    (isOpening &&
                        ((isPositiveDirection.value && diff < 0) || (!isPositiveDirection.value && diff > 0))) ||
                    (!isOpening &&
                        ((isPositiveDirection.value && diff > -1 * props.breakBoundary) ||
                            (!isPositiveDirection.value && diff < props.breakBoundary)))
                ) {
                    model.value = true;
                    await nextTick();
                    if (!bodySize) {
                        bodySize = parseFloat(
                            getComputedStyle(drawerBodyRef.value)[isHorizontal.value ? 'width' : 'height'],
                        );
                    }
                    const range2 = breakBoundary.value * (isPositiveDirection.value ? -1 : 1);
                    const translateVal = Math[isPositiveDirection.value ? 'max' : 'min'](
                        diff,
                        (isPositiveDirection.value ? -1 : 1) * (isOpening ? bodySize : 0) + range2,
                    );
                    const positivePosition = isPositiveDirection.value ? '' : '-';
                    const x = isHorizontal.value ? translateVal : 0;
                    const y = !isHorizontal.value ? translateVal : 0;
                    const translateX =
                        isOpening && isHorizontal.value ? `calc(${positivePosition}100% + ${x}px)` : `${x}px`;
                    const translateY =
                        isOpening && !isHorizontal.value ? `calc(${positivePosition}100% + ${y}px)` : `${y}px`;
                    drawerBodyTransform.value = `translate3d(${translateX}, ${translateY}, 0)`;
                }
            },
            end: async (_, { diffX, diffY }) => {
                if (!canSlide.value || !drawerBodyRef.value) return;
                const { width, height } = drawerContentRect.value;
                const changeStatusBoundary = (isHorizontal.value ? width : height) / 4;
                const diff = isHorizontal.value ? diffX : diffY;
                let i = -1;
                if (isHorizontal.value) {
                    i = isPositiveDirection.value ? (isOpening ? 3 : 1) : isOpening ? 1 : 3;
                } else {
                    i = isPositiveDirection.value ? (isOpening ? 0 : 2) : isOpening ? 2 : 0;
                }
                if (slideDirection.value[i]) {
                    if (!isOpening && Math.abs(diff) > changeStatusBoundary) {
                        model.value = !model.value;
                    } else if (isOpening && Math.abs(diff) < changeStatusBoundary) {
                        model.value = !model.value;
                    }
                }
                bodySize = 0;
                drawerContentRect.value = void 0;
                drawerBodyTransition.value = true;
                drawerBodyTransform.value = void 0;
            },
        });
        const canSlide = computed(() => !props.fullscreen && slots.swipe && props.slide);
        const isHorizontal = computed(() => ['left', 'right'].includes(props.direction));
        const isPositiveDirection = computed(() => ['left', 'top'].includes(props.direction));
        const breakBoundary = computed(() => (isNumber(props.breakBoundary) ? props.breakBoundary : 0));
        const bodySlideStopEvent = computed(() => {
            const events = {};
            if (!props.bodySlide) {
                const stopFunc = (e) => e.stopPropagation();
                const stopEvent = [handledEvents.value.down];
                for (const key of stopEvent) {
                    events[key] = stopFunc;
                }
            }
            return events;
        });
        const drawerBodyStyle = computed(() => {
            const styleMap = {
                left: 'right',
                right: 'left',
                top: 'bottom',
                bottom: 'top',
                size: isHorizontal.value ? 'width' : 'height',
            };
            return {
                position: props.fullscreen ? 'fixed' : 'absolute',
                [props.direction]: 'auto',
                [styleMap.size]: isNumber(props.size) ? `${props.size}px` : props.size,
                transform: drawerBodyTransform.value,
                transition: !drawerBodyTransition.value
                    ? void 0
                    : `transform var(--${namespace}-transition-duration) linear`,
            };
        });
        const drawerBodyClassName = computed(() => {
            const className = {
                right: 'ltr',
                left: 'rtl',
                top: 'btt',
                bottom: 'ttb',
            };
            return `${className[props.direction]}`;
        });
        const close = () => {
            if (!props.clickModelCose) return;
            model.value = false;
        };
        const handleTransitionEnd = () => {
            drawerBodyTransition.value = false;
        };
        return (_ctx, _cache) => {
            return (
                openBlock(),
                createElementBlock(
                    'div',
                    {
                        ref_key: 'slidRef',
                        ref: slidRef,
                        class: normalizeClass$1([unref(bem).b(), canSlide.value && unref(bem).bm('slide')]),
                    },
                    [
                        !_ctx.fullscreen
                            ? (openBlock(),
                              createElementBlock(
                                  'div',
                                  {
                                      key: 0,
                                      ref_key: 'drawerSwipeRef',
                                      ref: drawerSwipeRef,
                                      class: normalizeClass$1(unref(bem).be('swipe')),
                                  },
                                  [renderSlot(_ctx.$slots, 'swipe')],
                                  2,
                              ))
                            : createCommentVNode('', true),
                        (openBlock(),
                        createBlock(
                            Teleport,
                            {
                                to: 'body',
                                disabled: !_ctx.fullscreen,
                            },
                            [
                                createVNode(
                                    Transition,
                                    {
                                        name: unref(bem).ns('fade'),
                                    },
                                    {
                                        default: withCtx(() => [
                                            createVNode(
                                                unref(CdxOverlay),
                                                {
                                                    modelValue: unref(model),
                                                    'onUpdate:modelValue':
                                                        _cache[0] ||
                                                        (_cache[0] = ($event) =>
                                                            isRef(model) ? (model.value = $event) : null),
                                                    fullscreen: _ctx.fullscreen,
                                                    onClick: close,
                                                },
                                                {
                                                    default: withCtx(() => [
                                                        createElementVNode(
                                                            'div',
                                                            mergeProps(
                                                                {
                                                                    ref_key: 'drawerBodyRef',
                                                                    ref: drawerBodyRef,
                                                                    class: [
                                                                        unref(bem).be('body'),
                                                                        drawerBodyClassName.value,
                                                                    ],
                                                                    style: drawerBodyStyle.value,
                                                                    direction: _ctx.direction,
                                                                },
                                                                toHandlers(bodySlideStopEvent.value, true),
                                                                { onTransitionend: handleTransitionEnd },
                                                            ),
                                                            [
                                                                createElementVNode(
                                                                    'div',
                                                                    {
                                                                        class: normalizeClass$1(
                                                                            unref(bem).be('content'),
                                                                        ),
                                                                    },
                                                                    [renderSlot(_ctx.$slots, 'default')],
                                                                    2,
                                                                ),
                                                            ],
                                                            16,
                                                            _hoisted_1$4,
                                                        ),
                                                    ]),
                                                    _: 3,
                                                },
                                                8,
                                                ['modelValue', 'fullscreen'],
                                            ),
                                        ]),
                                        _: 3,
                                    },
                                    8,
                                    ['name'],
                                ),
                            ],
                            8,
                            ['disabled'],
                        )),
                    ],
                    2,
                )
            );
        };
    },
});
const CdxDrawer = withInstall(_sfc_main$e);
const overlayProps = buildProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    fullscreen: {
        type: Boolean,
        default: false,
    },
});
const overlayEmits = {
    click: (event) => event instanceof MouseEvent,
    [UPDATE_MODEL_EVENT]: (value) => isBoolean(value),
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
    ...{ name: 'CdxOverlay' },
    __name: 'overlay',
    props: overlayProps,
    emits: overlayEmits,
    setup(__props, { emit: __emit }) {
        const props = __props;
        const emits = __emit;
        const [, bem] = useBem('overlay');
        const [, scrollBem] = useBem('scroll');
        const { model } = useModelValue(props, false);
        const { onMouseDown, onMouseUp, onClick } = useSameClickTarget((e) => emits('click', e));
        const overlayRef = ref();
        const overlayStyle = computed(() => ({
            position: props.fullscreen ? 'fixed' : 'absolute',
        }));
        watch(
            () => model,
            async () => {
                var _a, _b;
                await nextTick();
                (_b = (_a = overlayRef.value) == null ? void 0 : _a.parentElement) == null
                    ? void 0
                    : _b.classList[model.value ? 'add' : 'remove'](scrollBem.bm('lock'));
            },
            {
                immediate: true,
            },
        );
        onMounted(() => {
            var _a;
            useLockScroll(model, { target: (_a = overlayRef.value) == null ? void 0 : _a.parentElement });
        });
        onBeforeUnmount(() => {
            var _a, _b;
            (_b = (_a = overlayRef.value) == null ? void 0 : _a.parentElement) == null
                ? void 0
                : _b.classList.remove(scrollBem.bm('lock'));
        });
        return (_ctx, _cache) => {
            return withDirectives(
                (openBlock(),
                createElementBlock(
                    'div',
                    mergeProps(
                        {
                            class: unref(bem).b(),
                            ref_key: 'overlayRef',
                            ref: overlayRef,
                            onClick:
                                _cache[0] ||
                                (_cache[0] = //@ts-ignore
                                    (...args) => unref(onClick) && unref(onClick)(...args)),
                            onMousedown:
                                _cache[1] ||
                                (_cache[1] = //@ts-ignore
                                    (...args) => unref(onMouseDown) && unref(onMouseDown)(...args)),
                            onMouseup:
                                _cache[2] ||
                                (_cache[2] = //@ts-ignore
                                    (...args) => unref(onMouseUp) && unref(onMouseUp)(...args)),
                            style: overlayStyle.value,
                        },
                        _ctx.$attrs,
                    ),
                    [renderSlot(_ctx.$slots, 'default')],
                    16,
                )),
                [[vShow, unref(model)]],
            );
        };
    },
});
const CdxOverlay = withInstall(_sfc_main$d);
const selectContextKey = Symbol('selectContextKey');
const elementSelectValueType = [String, Number, Boolean];
const elementSelectProps = buildProps({
    modelValue: {
        type: definePropType(Array),
        default: () => [],
    },
    tag: {
        type: String,
        default: 'div',
    },
    max: {
        type: Number,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});
const elementSelectEmits = {
    [UPDATE_MODEL_EVENT]: (value) => isArray(value),
    [CHANGE_EVENT]: (value) => isArray(value),
};
const isUnselect = false;
const _sfc_main$c = /* @__PURE__ */ defineComponent({
    ...{ name: 'CdxElementSelect' },
    __name: 'element-select',
    props: elementSelectProps,
    emits: elementSelectEmits,
    setup(__props, { emit: __emit }) {
        const props = __props;
        const emits = __emit;
        const [, bem] = useBem('element-select');
        const selectGroupRef = ref();
        const selecting = ref(false);
        const modelValue = computed({
            get() {
                return props.modelValue;
            },
            set(val) {
                changeEvent(val);
            },
        });
        const className = computed(() => {
            const classNames = [bem.b()];
            if (selecting.value) classNames.push(bem.bm('selecting'));
            return classNames;
        });
        const changeEvent = async (value) => {
            emits(UPDATE_MODEL_EVENT, value);
            await nextTick();
            emits(CHANGE_EVENT, value);
        };
        provide(selectContextKey, {
            ...pick(toRefs(props), ['max', 'disabled']),
            modelValue,
            changeEvent,
            selecting,
            isUnselect,
            selectGroupRef,
        });
        return (_ctx, _cache) => {
            return (
                openBlock(),
                createBlock(
                    resolveDynamicComponent(_ctx.tag),
                    {
                        ref_key: 'selectGroupRef',
                        ref: selectGroupRef,
                        class: normalizeClass$1(className.value),
                    },
                    {
                        default: withCtx(() => [renderSlot(_ctx.$slots, 'default')]),
                        _: 3,
                    },
                    8,
                    ['class'],
                )
            );
        };
    },
});
const elementSelectItemProps = buildProps({
    modelValue: {
        type: definePropType(elementSelectValueType),
    },
    trueValue: {
        type: definePropType(elementSelectValueType),
        default: true,
    },
    falseValue: {
        type: definePropType(elementSelectValueType),
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});
const elementSelectItemEmits = {
    [UPDATE_MODEL_EVENT]: (value) => isBoolean(value) || isNumber(value) || isString(value),
    [CHANGE_EVENT]: (value) => isBoolean(value) || isNumber(value) || isString(value),
};
const _hoisted_1$3 = ['value', 'true-value', 'false-value', 'disabled'];
const _sfc_main$b = /* @__PURE__ */ defineComponent({
    ...{ name: 'CdxElementSelectItem' },
    __name: 'element-select-item',
    props: elementSelectItemProps,
    emits: elementSelectItemEmits,
    setup(__props, { emit: __emit }) {
        const props = __props;
        const emits = __emit;
        const selectContext = inject(selectContextKey, void 0);
        const [, bem] = useBem('element-select-item');
        const curStatus = ref(false);
        const className = computed(() => [
            bem.b(),
            isChecked.value && bem.bm('checked'),
            isDisabled.value && bem.bm('disabled'),
        ]);
        const model = computed({
            get() {
                var _a;
                return selectContext
                    ? selectContext.modelValue.value
                    : (_a = props.modelValue) != null
                      ? _a
                      : curStatus.value;
            },
            set(val) {
                if (selectContext) {
                    const value = val;
                    if (isMaxGroup.value && value.length > selectContext.modelValue.value.length) return;
                    selectContext.modelValue.value = value;
                } else {
                    const value = val;
                    emits(UPDATE_MODEL_EVENT, value);
                    curStatus.value = value;
                }
            },
        });
        const isChecked = computed(() =>
            selectContext ? model.value.includes(props.trueValue) : model.value === props.trueValue,
        );
        const isDisabled = computed(() => {
            var _a, _b;
            if (
                props.disabled ||
                ((_a = selectContext == null ? void 0 : selectContext.disabled) == null ? void 0 : _a.value)
            )
                return true;
            if (!isChecked.value && selectContext) {
                const value = model.value;
                if (((_b = selectContext.max) == null ? void 0 : _b.value) && value.length >= selectContext.max.value)
                    return true;
            }
            return false;
        });
        const isMaxGroup = computed(() => {
            var _a;
            return (
                selectContext &&
                ((_a = selectContext.max) == null ? void 0 : _a.value) !== void 0 &&
                selectContext.modelValue.value.length >= selectContext.max.value
            );
        });
        const setValue = (status) => {
            if (isDisabled.value) return;
            const { trueValue, falseValue } = props;
            if (selectContext) {
                const value = selectContext.modelValue.value;
                if (status) {
                    model.value = value.concat(trueValue);
                } else {
                    const i = value.indexOf(trueValue);
                    i !== -1 && (model.value = value.slice(0, i).concat(value.slice(i + 1)));
                }
            } else {
                model.value = status ? trueValue : falseValue;
            }
            emits(CHANGE_EVENT, status ? trueValue : falseValue);
        };
        const handleChange = (e) => {
            const target = e.target;
            emits(CHANGE_EVENT, target.checked ? props.trueValue : props.falseValue);
        };
        const handleUp = () => {
            selectContext && (selectContext.selecting.value = false);
            document.removeEventListener('mouseup', handleUp);
        };
        const handleDown = () => {
            if (isDisabled.value) return;
            const status = isChecked.value;
            setValue(!status);
            if (!selectContext) return;
            selectContext.selecting.value = true;
            selectContext.isUnselect = status;
            document.addEventListener('mouseup', handleUp);
        };
        const handleEnter = () => {
            if (!selectContext || isDisabled.value) return;
            if (selectContext.selecting.value && isChecked.value !== !selectContext.isUnselect) {
                setValue(!selectContext.isUnselect);
            }
        };
        return (_ctx, _cache) => {
            return (
                openBlock(),
                createElementBlock(
                    'label',
                    {
                        class: normalizeClass$1(className.value),
                        onMousedown: handleDown,
                        onMouseenter: handleEnter,
                        onClick: _cache[1] || (_cache[1] = withModifiers(() => {}, ['prevent'])),
                    },
                    [
                        renderSlot(_ctx.$slots, 'default'),
                        isChecked.value || isDisabled.value
                            ? (openBlock(),
                              createElementBlock(
                                  'div',
                                  {
                                      key: 0,
                                      class: normalizeClass$1(unref(bem).be('mask')),
                                  },
                                  [renderSlot(_ctx.$slots, 'mask')],
                                  2,
                              ))
                            : createCommentVNode('', true),
                        withDirectives(
                            createElementVNode(
                                'input',
                                {
                                    class: normalizeClass$1(unref(bem).be('input')),
                                    'onUpdate:modelValue':
                                        _cache[0] || (_cache[0] = ($event) => (model.value = $event)),
                                    type: 'checkbox',
                                    value: _ctx.trueValue,
                                    'true-value': _ctx.trueValue,
                                    'false-value': _ctx.falseValue,
                                    disabled: isDisabled.value,
                                    onChange: handleChange,
                                },
                                null,
                                42,
                                _hoisted_1$3,
                            ),
                            [[vModelCheckbox, model.value]],
                        ),
                    ],
                    34,
                )
            );
        };
    },
});
const CdxElementSelect = withInstall(_sfc_main$c);
const CdxElementSelectItem = withInstall(_sfc_main$b);
const _sfc_main$a = /* @__PURE__ */ defineComponent({
    ...{ name: 'CdxIcon' },
    __name: 'icon',
    setup(__props) {
        const [, bem] = useBem('icon');
        return (_ctx, _cache) => {
            return (
                openBlock(),
                createElementBlock(
                    'i',
                    {
                        class: normalizeClass$1(unref(bem).b()),
                    },
                    [renderSlot(_ctx.$slots, 'default')],
                    2,
                )
            );
        };
    },
});
const CdxIcon = withInstall(_sfc_main$a);
let HTMLElement;
if (typeof window !== 'undefined') {
    HTMLElement = window.HTMLElement;
}
const loadingProps = buildProps({
    text: {
        type: String,
    },
    background: {
        type: String,
    },
    fullscreen: {
        type: Boolean,
        default: false,
    },
    visible: {
        type: Boolean,
        default: false,
    },
    target: {
        type: [String, HTMLElement],
    },
    lock: {
        type: Boolean,
        default: true,
    },
});
const _hoisted_1$2 = /* @__PURE__ */ createElementVNode(
    'circle',
    {
        cx: '25',
        cy: '25',
        r: '20',
        fill: 'none',
    },
    null,
    -1,
);
const _hoisted_2$1 = [_hoisted_1$2];
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
    ...{ name: 'CdxLoading' },
    __name: 'loading',
    props: loadingProps,
    setup(__props) {
        const props = __props;
        const [, bem] = useBem('loading');
        const { currentZIndex, nextZIndex } = useZIndex();
        const loadingRef = ref();
        const loadingStyle = computed(() => ({
            backgroundColor: props == null ? void 0 : props.background,
            zIndex: props.fullscreen ? currentZIndex.value : void 0,
        }));
        const isLock = computed(() => props.lock && props.visible);
        watch(
            () => [props.visible, props.fullscreen],
            () => {
                if (props.fullscreen && props.visible) {
                    nextZIndex();
                }
            },
            {
                immediate: true,
            },
        );
        onMounted(() => {
            var _a;
            useLockScroll(isLock, { target: (_a = loadingRef.value) == null ? void 0 : _a.parentElement });
        });
        return (_ctx, _cache) => {
            return (
                openBlock(),
                createBlock(
                    Teleport,
                    {
                        to: _ctx.target,
                        disabled: !_ctx.target,
                    },
                    [
                        createVNode(
                            Transition,
                            {
                                name: unref(bem).ns('fade'),
                                appear: '',
                            },
                            {
                                default: withCtx(() => [
                                    _ctx.visible
                                        ? (openBlock(),
                                          createElementBlock(
                                              'div',
                                              {
                                                  key: 0,
                                                  ref_key: 'loadingRef',
                                                  ref: loadingRef,
                                                  class: normalizeClass$1([
                                                      unref(bem).be('mask'),
                                                      _ctx.fullscreen && unref(bem).bm('fullscreen'),
                                                  ]),
                                                  style: normalizeStyle$1(loadingStyle.value),
                                              },
                                              [
                                                  createElementVNode(
                                                      'div',
                                                      {
                                                          class: normalizeClass$1(unref(bem).be('tip')),
                                                      },
                                                      [
                                                          (openBlock(),
                                                          createElementBlock(
                                                              'svg',
                                                              {
                                                                  class: normalizeClass$1(unref(bem).be('spinner')),
                                                                  viewBox: '0 0 50 50',
                                                              },
                                                              _hoisted_2$1,
                                                              2,
                                                          )),
                                                          _ctx.text
                                                              ? (openBlock(),
                                                                createElementBlock(
                                                                    'span',
                                                                    {
                                                                        key: 0,
                                                                        class: normalizeClass$1(unref(bem).be('text')),
                                                                    },
                                                                    toDisplayString$1(_ctx.text),
                                                                    3,
                                                                ))
                                                              : createCommentVNode('', true),
                                                      ],
                                                      2,
                                                  ),
                                              ],
                                              6,
                                          ))
                                        : createCommentVNode('', true),
                                ]),
                                _: 1,
                            },
                            8,
                            ['name'],
                        ),
                    ],
                    8,
                    ['to', 'disabled'],
                )
            );
        };
    },
});
let unmountTimer$1 = setTimeout(() => {}, 0);
const createLoadingInstance = (props) => {
    const data = reactive({
        visible: true,
    });
    const load = defineComponent({
        name: 'CdxLoading',
        setup(props2) {
            return () =>
                h(_sfc_main$9, {
                    ...props2,
                    visible: data.visible,
                });
        },
    });
    const loadingInstance = createApp(load, props);
    const vm = loadingInstance.mount(document.createElement('div'));
    const close = () => {
        clearTimeout(unmountTimer$1);
        unmountTimer$1 = setTimeout(() => {
            if (vm) {
                vm.$el.remove();
                loadingInstance.unmount();
            }
        }, 300);
        data.visible = false;
    };
    return {
        instance: loadingInstance,
        vm,
        close,
    };
};
const resolveOptions$1 = (options = {}) => {
    var _a, _b, _c;
    let target;
    if (isString(options.target)) {
        target = (_a = document.querySelector(options.target)) != null ? _a : document.body;
    } else {
        target = options.target || document.body;
    }
    return {
        text: options.text || '',
        background: options.background || '',
        fullscreen: target === document.body && ((_b = options.fullscreen) != null ? _b : true),
        lock: (_c = options.lock) != null ? _c : true,
        target,
    };
};
let fullscreenInstance = void 0;
const vLoading$1 = (options) => {
    const [, relativeBem] = useBem('relative');
    const resolvedOps = resolveOptions$1(options);
    if (resolvedOps.fullscreen && fullscreenInstance) return fullscreenInstance;
    const instance = createLoadingInstance(resolvedOps);
    if (resolvedOps.fullscreen) {
        fullscreenInstance = instance;
    }
    const originClose = instance.close;
    instance.close = () => {
        originClose();
        resolvedOps.target.classList.remove(relativeBem.b());
        if (resolvedOps.fullscreen) {
            fullscreenInstance = void 0;
        }
    };
    resolvedOps.target.classList.add(relativeBem.b());
    resolvedOps.target.appendChild(instance.vm.$el);
    return instance;
};
const LOADING_INSTANCE = Symbol('loading');
const bindLoadingInstance = (el, binding) => {
    el[LOADING_INSTANCE] = createLoadingInstance({
        target: el,
        text: el.getAttribute('loading-text') || void 0,
        background: el.getAttribute('loading-background') || void 0,
    });
};
const unmounLoadingInstance = (el) => {
    var _a;
    if ((_a = el[LOADING_INSTANCE]) == null ? void 0 : _a.instance) {
        el[LOADING_INSTANCE].close();
        delete el[LOADING_INSTANCE];
    }
};
const vLoading = {
    mounted(el, binding) {
        if (binding.value) {
            bindLoadingInstance(el, binding);
        }
    },
    updated(el, binding) {
        if (binding.value) {
            !el[LOADING_INSTANCE] && bindLoadingInstance(el, binding);
        } else {
            unmounLoadingInstance(el);
        }
    },
    unmounted(el) {
        unmounLoadingInstance(el);
    },
};
const CdxLoadingDirective = withInstallDirective(vLoading, 'loading');
const CdxLoading = withInstall(_sfc_main$9, {
    directive: CdxLoadingDirective,
    service: vLoading$1,
});
var CheckStatus = /* @__PURE__ */ ((CheckStatus2) => {
    CheckStatus2['success'] = 'success';
    CheckStatus2['fail'] = 'fail';
    CheckStatus2['none'] = 'none';
    return CheckStatus2;
})(CheckStatus || {});
var CaptchType = /* @__PURE__ */ ((CaptchType2) => {
    CaptchType2['slider'] = 'slider';
    CaptchType2['pointer'] = 'pointer';
    return CaptchType2;
})(CaptchType || {});
const captchaProps = buildProps({
    type: {
        type: String,
        values: ['slider', 'pointer'],
        default: 'slider',
        /* slider */
    },
    image: {
        type: String,
        required: true,
    },
    canvasSize: {
        type: definePropType(Array),
        default: () => [500, 300],
    },
    texts: {
        type: definePropType(Array),
        validator: (v) => Array.isArray(v) && v.every((item) => typeof item === 'string' && item.length === 1),
    },
    fontRate: {
        type: Number,
        default: 0.108,
        validator: (v) => typeof v === 'number' && v >= 0 && v <= 1,
    },
    onBeforSuccess: {
        type: definePropType(Function),
    },
    loading: {
        type: Boolean,
        default: false,
    },
    onRefresh: {
        type: definePropType(Function),
    },
    tipDuration: {
        type: Number,
        default: 3e3,
    },
});
const captchaEmits = {
    success: () => true,
    fail: () => true,
    imgError: () => true,
};
const squarePath = ({ ctx, x, y, width, height }) => {
    const side = Math.min(width, height) * 0.25;
    const halfSide = side * 0.5;
    ctx.moveTo(x - halfSide, y - halfSide);
    ctx.lineTo(x + halfSide, y - halfSide);
    ctx.lineTo(x + halfSide, y + halfSide);
    ctx.lineTo(x - halfSide, y + halfSide);
    ctx.closePath();
    return [x - halfSide - 2, y - halfSide - 2, side + 4, side + 4];
};
const _hoisted_1$1 = ['width', 'height'];
const _hoisted_2 = ['height'];
const _hoisted_3 = ['onClick'];
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
    ...{ name: 'CdxCaptcha' },
    __name: 'captcha',
    props: captchaProps,
    emits: captchaEmits,
    setup(__props, { emit: __emit }) {
        const props = __props;
        const emits = __emit;
        const getSlideTarget = () => {
            return [Math.random() * 50 + 25, Math.random() * 50 + 25];
        };
        let tipVisibleTimer = setTimeout(() => {}, 0);
        const [, bem] = useBem('captcha');
        const canvasRef = ref();
        const subCanvasRef = ref();
        const sliderRef = ref();
        const pointerTargets = [];
        const pointers = ref([]);
        const checkTip = ref('');
        const checkStatus = ref(CheckStatus.none);
        const checkTipVisible = ref(false);
        const imageLoading = ref(true);
        const vertifyLoading = ref(false);
        const refreshLoading = ref(false);
        const slideTarget = ref(getSlideTarget());
        const imageLoadFailed = ref(false);
        const trackRef = computed(() => {
            var _a;
            return (_a = sliderRef.value) == null ? void 0 : _a.trackRef;
        });
        const currentX = computed(() => {
            var _a;
            return (_a = sliderRef.value) == null ? void 0 : _a.currentX;
        });
        const isLoading = computed(
            () => props.loading || imageLoading.value || vertifyLoading.value || refreshLoading.value,
        );
        const isLock = computed(
            () => checkStatus.value === CheckStatus.success || isLoading.value || imageLoadFailed.value,
        );
        const subCanvasStyle = computed(() => {
            var _a;
            return {
                [bem.cv('captcha-sub-image-transition')]: ((_a = sliderRef.value) == null ? void 0 : _a.resetting)
                    ? 'left 250ms ease'
                    : 'left 0ms ease',
                left: `${currentX.value}%`,
            };
        });
        const cancelPointer = (i) => {
            if (isLock.value) return;
            pointers.value = pointers.value.slice(0, i);
        };
        const verifyPointers = () => {
            if (!canvasRef.value) return;
            const { width, height } = canvasRef.value;
            const fontSize = Math.max(width, height) * props.fontRate;
            const xTolerance = (fontSize / width) * 50;
            const yTolerance = (fontSize / height) * 50;
            let result = true;
            for (let i = 0, len = pointers.value.length; i < len; ++i) {
                const [x, y] = pointers.value[i];
                const [targetX, targetY] = pointerTargets[i];
                if (Math.abs(x - targetX) > xTolerance || Math.abs(y - targetY) > yTolerance) {
                    result = false;
                    break;
                }
            }
            return result;
        };
        const formatBeforeSuccess = async () => {
            vertifyLoading.value = true;
            let isSuccess = false;
            let message = void 0;
            const result = await props.onBeforSuccess();
            if (isBoolean(result)) {
                isSuccess = result;
            } else {
                isSuccess = !!result.success;
                message = result.message;
            }
            vertifyLoading.value = false;
            return {
                isSuccess,
                message,
            };
        };
        const checkedFail = (message = '验证失败，请重试') => {
            clearTimeout(tipVisibleTimer);
            if (checkTipVisible.value) checkTipVisible.value = false;
            nextTick(() => {
                checkTip.value = message;
                checkStatus.value = CheckStatus.fail;
                pointers.value = [];
                emits('fail');
                checkTipVisible.value = true;
                tipVisibleTimer = setTimeout(() => {
                    checkTipVisible.value = false;
                }, props.tipDuration);
            });
        };
        const checkedSuccess = (message = '验证成功') => {
            clearTimeout(tipVisibleTimer);
            if (checkTipVisible.value) checkTipVisible.value = false;
            nextTick(() => {
                checkTip.value = message;
                checkStatus.value = CheckStatus.success;
                checkTipVisible.value = true;
                emits('success');
                tipVisibleTimer = setTimeout(() => {
                    checkTipVisible.value = false;
                }, props.tipDuration);
            });
        };
        const loadImage = async (imageSrc) => {
            imageLoading.value = true;
            return await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    resolve(img);
                };
                img.onerror = (e) => {
                    console.log(e);
                    reject(new Error('图片加载失败'));
                    imageLoadFailed.value = true;
                    emits('imgError');
                };
                img.src = imageSrc;
            }).finally(() => {
                imageLoading.value = false;
            });
        };
        const drawText = (ctx, { width, height }) => {
            var _a;
            if (!((_a = props.texts) == null ? void 0 : _a.length)) return;
            const fontSize = Math.max(width, height) * props.fontRate;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#fff';
            const drawTextOnCanvas = (text, x, y, radian = 0, color = generateRandomColor()) => {
                ctx.save();
                ctx.translate(x, y);
                radian && ctx.rotate(radian * Math.PI);
                ctx.fillStyle = color;
                ctx.fillText(text, 0, 0);
                ctx.strokeText(text, 0, 0);
                ctx.restore();
            };
            const metrics = ctx.measureText(props.texts[0]);
            const xLimit = Math.max(fontSize, metrics.width) * 1.2;
            const yLimit = Math.max(fontSize, metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent) * 1.2;
            let prevX = -2 * fontSize;
            let prevY = -2 * fontSize;
            for (const text of props.texts) {
                let x = prevX;
                let y = prevY;
                while (Math.abs(x - prevX) < xLimit && Math.abs(y - prevY) < yLimit) {
                    x = width * 0.1 + Math.random() * width * 0.8;
                    y = height * 0.1 + Math.random() * height * 0.8;
                }
                prevX = x;
                prevY = y;
                pointerTargets.push([(x / width) * 100, (y / height) * 100]);
                drawTextOnCanvas(text, x, y, Math.random() * 2);
            }
        };
        const drawImage = async (imageSrc, canvasEl) => {
            var _a;
            const image = await loadImage(imageSrc);
            if (!image || !canvasEl) return;
            const ctx = canvasEl.getContext('2d');
            if (!ctx) return;
            const { width, height } = canvasEl;
            ctx.drawImage(image, 0, 0, width, height);
            if (props.type === CaptchType.pointer) {
                return drawText(ctx, { width, height });
            }
            const subCanvasEl = subCanvasRef.value;
            const subCtx =
                (_a = subCanvasEl == null ? void 0 : subCanvasEl.getContext) == null
                    ? void 0
                    : _a.call(subCanvasEl, '2d');
            if (!subCanvasEl || !subCtx || !trackRef.value) return;
            if (props.type === CaptchType.slider) {
                const canvasRect = canvasEl.getBoundingClientRect();
                const trackRect = trackRef.value.getBoundingClientRect();
                const widthFix = ((canvasRect.width - trackRect.width) / canvasRect.width) * canvasEl.width;
                const targetX = widthFix / 2 + slideTarget.value[0] * (canvasEl.width - widthFix) * 0.01;
                const targetY = slideTarget.value[1] * canvasEl.height * 0.01;
                const pathCanvas = document.createElement('canvas');
                pathCanvas.width = canvasEl.width;
                pathCanvas.height = canvasEl.height;
                const pathCtx = pathCanvas.getContext('2d');
                if (!pathCtx) return;
                pathCtx.drawImage(image, 0, 0, width, height);
                pathCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                pathCtx.lineWidth = 4;
                const [clipX, clipY, clipWidth, clipHeight] = squarePath({
                    ctx: pathCtx,
                    x: targetX,
                    y: targetY,
                    width: props.canvasSize[0],
                    height: props.canvasSize[1],
                });
                const xLeftWidth = targetX - clipX;
                const translateFix = ((clipWidth * 0.5 - xLeftWidth) / clipWidth) * 100;
                subCanvasEl.style.transform = `translate3d(${translateFix - 50}%, 0, 0)`;
                subCanvasEl.width = clipWidth;
                subCtx.drawImage(pathCanvas, clipX, clipY, clipWidth, clipHeight, 0, clipY, clipWidth, clipHeight);
                ctx.save();
                ctx.beginPath();
                squarePath({
                    ctx,
                    x: targetX,
                    y: targetY,
                    width: props.canvasSize[0],
                    height: props.canvasSize[1],
                });
                ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 6;
                ctx.stroke();
                ctx.fill();
            }
        };
        const handleRefresh = async () => {
            if (isLoading.value || checkStatus.value === CheckStatus.success) return;
            pointerTargets.splice(0, pointerTargets.length);
            pointers.value = [];
            slideTarget.value = getSlideTarget();
            checkStatus.value = CheckStatus.none;
            checkTipVisible.value = false;
            refreshLoading.value = true;
            isFunction(props.onRefresh) && (await props.onRefresh());
            await nextTick();
            refreshLoading.value = false;
        };
        const handlePointerSetClick = async (e) => {
            if (props.type !== CaptchType.pointer || !canvasRef.value || !pointerTargets.length || isLock.value) return;
            const { offsetX, offsetY } = e;
            const { clientWidth: width, clientHeight: height } = canvasRef.value;
            pointers.value.push([(offsetX / width) * 100, (offsetY / height) * 100]);
            if (pointers.value.length >= pointerTargets.length) {
                if (verifyPointers()) {
                    if (props.onBeforSuccess) {
                        vertifyLoading.value = true;
                        const { isSuccess, message } = await formatBeforeSuccess();
                        isSuccess ? checkedSuccess(message) : checkedFail(message);
                    } else {
                        checkedSuccess();
                    }
                } else {
                    checkedFail();
                }
            }
        };
        const handleSliderSuccess = async () => {
            var _a;
            if (props.onBeforSuccess) {
                const { isSuccess, message } = await formatBeforeSuccess();
                if (isSuccess) {
                    checkedSuccess(message);
                } else {
                    checkedFail(message);
                    (_a = sliderRef.value) == null ? void 0 : _a.reset();
                }
            } else {
                checkedSuccess();
            }
        };
        const handleSliderFail = () => {
            checkedFail();
        };
        const reset = () => {
            pointerTargets.length = 0;
            pointers.value = [];
            checkStatus.value = CheckStatus.none;
            checkTipVisible.value = false;
            vertifyLoading.value = false;
            refreshLoading.value = false;
            slideTarget.value = getSlideTarget();
            imageLoadFailed.value = false;
            sliderRef.value && sliderRef.value.reset();
            drawImage(props.image, canvasRef.value);
        };
        watch(
            () => [props.texts, props.image, props.type],
            () => {
                reset();
            },
        );
        onMounted(() => {
            drawImage(props.image, canvasRef.value);
        });
        return (_ctx, _cache) => {
            return (
                openBlock(),
                createElementBlock(
                    'div',
                    {
                        class: normalizeClass$1(unref(bem).b()),
                    },
                    [
                        createElementVNode(
                            'div',
                            {
                                class: normalizeClass$1(unref(bem).be('header')),
                            },
                            [
                                createElementVNode(
                                    'button',
                                    {
                                        class: normalizeClass$1([
                                            unref(bem).bs('refresh'),
                                            (checkStatus.value === unref(CheckStatus).success || isLoading.value) &&
                                                unref(bem).bm('disabled'),
                                        ]),
                                        onClick: handleRefresh,
                                    },
                                    [renderSlot(_ctx.$slots, 'refresh', {}, () => [createTextVNode('刷新')])],
                                    2,
                                ),
                            ],
                            2,
                        ),
                        createElementVNode(
                            'div',
                            {
                                class: normalizeClass$1([
                                    unref(bem).be('container'),
                                    isLock.value && unref(bem).bem('container', 'lock'),
                                    _ctx.type === unref(CaptchType).pointer && unref(bem).bs('pointer'),
                                ]),
                                onClick: handlePointerSetClick,
                            },
                            [
                                _ctx.image
                                    ? (openBlock(),
                                      createElementBlock(
                                          Fragment,
                                          { key: 0 },
                                          [
                                              createElementVNode(
                                                  'canvas',
                                                  {
                                                      class: normalizeClass$1(unref(bem).be('canvas')),
                                                      ref_key: 'canvasRef',
                                                      ref: canvasRef,
                                                      width: _ctx.canvasSize[0],
                                                      height: _ctx.canvasSize[1],
                                                  },
                                                  null,
                                                  10,
                                                  _hoisted_1$1,
                                              ),
                                              _ctx.type === unref(CaptchType).slider
                                                  ? (openBlock(),
                                                    createElementBlock(
                                                        'div',
                                                        {
                                                            key: 0,
                                                            class: normalizeClass$1(unref(bem).be('sub-image')),
                                                        },
                                                        [
                                                            createElementVNode(
                                                                'canvas',
                                                                {
                                                                    ref_key: 'subCanvasRef',
                                                                    ref: subCanvasRef,
                                                                    class: normalizeClass$1(
                                                                        unref(bem).be('sub-canvas'),
                                                                    ),
                                                                    height: _ctx.canvasSize[1],
                                                                    style: normalizeStyle$1(subCanvasStyle.value),
                                                                },
                                                                null,
                                                                14,
                                                                _hoisted_2,
                                                            ),
                                                        ],
                                                        2,
                                                    ))
                                                  : createCommentVNode('', true),
                                          ],
                                          64,
                                      ))
                                    : createCommentVNode('', true),
                                _ctx.type === unref(CaptchType).pointer
                                    ? (openBlock(true),
                                      createElementBlock(
                                          Fragment,
                                          { key: 1 },
                                          renderList(pointers.value, ([x, y], i) => {
                                              return (
                                                  openBlock(),
                                                  createElementBlock(
                                                      'span',
                                                      {
                                                          class: normalizeClass$1(unref(bem).be('pointer')),
                                                          style: normalizeStyle$1({ top: `${y}%`, left: `${x}%` }),
                                                          onClick: withModifiers(() => cancelPointer(i), ['stop']),
                                                      },
                                                      toDisplayString$1(i + 1),
                                                      15,
                                                      _hoisted_3,
                                                  )
                                              );
                                          }),
                                          256,
                                      ))
                                    : createCommentVNode('', true),
                                withDirectives(
                                    createVNode(
                                        Transition,
                                        {
                                            appear: '',
                                            name: unref(bem).ns('fade'),
                                        },
                                        {
                                            default: withCtx(() => [
                                                createElementVNode(
                                                    'div',
                                                    {
                                                        class: normalizeClass$1([
                                                            unref(bem).be('tip'),
                                                            unref(bem).bem('tip', checkStatus.value),
                                                            'btt',
                                                        ]),
                                                    },
                                                    [
                                                        createElementVNode(
                                                            'span',
                                                            {
                                                                class: normalizeClass$1(unref(bem).be('tip-text')),
                                                            },
                                                            toDisplayString$1(checkTip.value),
                                                            3,
                                                        ),
                                                    ],
                                                    2,
                                                ),
                                            ]),
                                            _: 1,
                                        },
                                        8,
                                        ['name'],
                                    ),
                                    [[vShow, checkTipVisible.value]],
                                ),
                                createVNode(unref(CdxLoading), { visible: isLoading.value }, null, 8, ['visible']),
                            ],
                            2,
                        ),
                        createElementVNode(
                            'div',
                            {
                                class: normalizeClass$1(unref(bem).be('footer')),
                            },
                            [
                                _ctx.type === unref(CaptchType).pointer
                                    ? (openBlock(),
                                      createElementBlock(
                                          'div',
                                          {
                                              key: 0,
                                              class: normalizeClass$1(unref(bem).be('text-list')),
                                          },
                                          [
                                              createElementVNode(
                                                  'span',
                                                  {
                                                      class: normalizeClass$1(unref(bem).be('tip')),
                                                  },
                                                  '请依次点击：',
                                                  2,
                                              ),
                                              (openBlock(true),
                                              createElementBlock(
                                                  Fragment,
                                                  null,
                                                  renderList(_ctx.texts, (s) => {
                                                      return (
                                                          openBlock(),
                                                          createElementBlock(
                                                              'span',
                                                              {
                                                                  class: normalizeClass$1(
                                                                      unref(bem).bem('tip-text', 'blod'),
                                                                  ),
                                                              },
                                                              toDisplayString$1(s),
                                                              3,
                                                          )
                                                      );
                                                  }),
                                                  256,
                                              )),
                                          ],
                                          2,
                                      ))
                                    : _ctx.type === unref(CaptchType).slider
                                      ? (openBlock(),
                                        createBlock(
                                            unref(CdxCaptchaSlider),
                                            {
                                                key: 1,
                                                ref_key: 'sliderRef',
                                                ref: sliderRef,
                                                lock: isLock.value,
                                                loading: isLoading.value,
                                                target: slideTarget.value[0],
                                                onSuccess: handleSliderSuccess,
                                                onFail: handleSliderFail,
                                            },
                                            null,
                                            8,
                                            ['lock', 'loading', 'target'],
                                        ))
                                      : createCommentVNode('', true),
                            ],
                            2,
                        ),
                    ],
                    2,
                )
            );
        };
    },
});
const captchaSliderProps = buildProps({
    target: {
        type: Number,
        default: 100,
        validator: (value) => value >= 0 && value <= 100,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    lock: {
        type: Boolean,
        default: false,
    },
    tolerance: {
        type: Number,
        default: 1,
        validator: (value) => value >= 0 && value <= 100,
    },
    onBeforeSuccess: {
        type: definePropType(Function),
    },
});
const captchaSliderEmits = {
    success: () => true,
    move: (value) => isNumber(value),
    fail: () => true,
};
const CaptchaSliderEmits = typeof captchaSliderEmits;
const _hoisted_1 = { key: 1 };
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
    ...{ name: 'CdxCaptchaSlider' },
    __name: 'captcha-slider',
    props: captchaSliderProps,
    emits: captchaSliderEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
        const { isSupportTouch, events: handledEvents } = useSupportTouch();
        const props = __props;
        const emits = __emit;
        const [_, bem] = useBem('captcha-slider');
        let trackWidth = 1;
        const trackRef = ref();
        const startX = ref(0);
        const moveX = ref(0);
        const isSuccess = ref(false);
        const dragging = ref(false);
        const resetting = ref(false);
        const matchLoading = ref(false);
        const isLoading = computed(() => props.loading || matchLoading.value);
        const isLock = computed(() => props.lock || isLoading.value || isSuccess.value);
        const currentX = computed(() => {
            const pre = (moveX.value - startX.value) / trackWidth;
            return Math.max(Math.min(pre, 1), 0) * 100;
        });
        const fillStyle = computed(() => ({
            [bem.cv('captcha-slider-bg-transition')]: resetting.value ? 'width 300ms ease' : void 0,
            width: `${currentX.value}%`,
        }));
        const tipStyle = computed(() => ({
            [bem.cv('captcha-slider-tip-transition')]: resetting.value ? 'background-position-x 300ms ease' : void 0,
            backgroundPositionX: `${-currentX.value}%`,
        }));
        const innerStyle = computed(() => ({
            [bem.cv('captcha-slider-trigger-transition')]: resetting.value ? 'width 300ms ease' : void 0,
            width: `${currentX.value}%`,
        }));
        const verifyMatch = () => {
            const nleft = currentX.value - props.tolerance;
            const nright = currentX.value + props.tolerance;
            return nleft <= props.target && nright >= props.target;
        };
        const handleDown = (e) => {
            if (resetting.value || isLock.value || isLoading.value) return;
            const touchEvent = e;
            const mouseEvent = e;
            startX.value = isSupportTouch.value ? touchEvent.changedTouches[0].clientX : mouseEvent.clientX;
            trackWidth = trackRef.value.getBoundingClientRect().width;
            document.addEventListener(handledEvents.value.move, handleMove);
            document.addEventListener(handledEvents.value.up, handleUp);
            dragging.value = true;
        };
        const handleMove = (e) => {
            if (resetting.value || isSuccess.value) return;
            const touchEvent = e;
            const mouseEvent = e;
            moveX.value = isSupportTouch.value ? touchEvent.changedTouches[0].clientX : mouseEvent.clientX;
            emits('move', currentX.value);
        };
        const handleUp = async () => {
            if (resetting.value || isSuccess.value) return;
            document.removeEventListener(handledEvents.value.move, handleMove);
            document.removeEventListener(handledEvents.value.up, handleUp);
            matchLoading.value = true;
            let beforeMatched;
            if (isFunction(props.onBeforeSuccess)) {
                beforeMatched = await props.onBeforeSuccess();
            }
            const matched = verifyMatch();
            if (matched && (isUndefined(beforeMatched) || beforeMatched)) {
                isSuccess.value = true;
                matchLoading.value = false;
                emits('success');
            } else {
                emits('fail');
                reset();
            }
            dragging.value = false;
        };
        const reset = () => {
            if (moveX.value !== 0) {
                resetting.value = true;
                moveX.value = 0;
            }
            isSuccess.value = false;
            matchLoading.value = false;
        };
        const afterReset = () => {
            resetting.value = false;
        };
        __expose({
            trackRef,
            currentX,
            resetting,
            reset,
        });
        return (_ctx, _cache) => {
            return (
                openBlock(),
                createElementBlock(
                    'div',
                    {
                        class: normalizeClass$1([unref(bem).b()]),
                    },
                    [
                        createElementVNode(
                            'div',
                            {
                                class: normalizeClass$1(unref(bem).be('bg')),
                                style: normalizeStyle$1(fillStyle.value),
                            },
                            null,
                            6,
                        ),
                        createElementVNode(
                            'div',
                            {
                                class: normalizeClass$1(unref(bem).be('tip')),
                                style: normalizeStyle$1(tipStyle.value),
                            },
                            [
                                renderSlot(_ctx.$slots, 'tip', { isSuccess: isSuccess.value }, () => [
                                    createTextVNode(toDisplayString$1(isSuccess.value ? '验证成功' : '滑动滑块'), 1),
                                ]),
                            ],
                            6,
                        ),
                        createElementVNode(
                            'div',
                            {
                                ref_key: 'trackRef',
                                ref: trackRef,
                                class: normalizeClass$1(unref(bem).be('track')),
                            },
                            [
                                createElementVNode(
                                    'div',
                                    {
                                        class: normalizeClass$1(unref(bem).be('inner')),
                                        style: normalizeStyle$1(innerStyle.value),
                                        onTransitionend: afterReset,
                                    },
                                    [
                                        createElementVNode(
                                            'div',
                                            mergeProps(
                                                {
                                                    class: [
                                                        unref(bem).be('trigger'),
                                                        (isLock.value || isLoading.value) &&
                                                            unref(bem).bem('trigger', 'lock'),
                                                    ],
                                                },
                                                { [toHandlerKey$1(unref(handledEvents).down)]: handleDown },
                                            ),
                                            [
                                                renderSlot(_ctx.$slots, 'trigger', {}, () => [
                                                    isLoading.value
                                                        ? (openBlock(),
                                                          createBlock(unref(CdxLoading), {
                                                              key: 0,
                                                              visible: true,
                                                          }))
                                                        : (openBlock(), createElementBlock('span', _hoisted_1, '->')),
                                                ]),
                                            ],
                                            16,
                                        ),
                                    ],
                                    38,
                                ),
                            ],
                            2,
                        ),
                    ],
                    2,
                )
            );
        };
    },
});
const CdxCaptcha = withInstall(_sfc_main$8);
const CdxCaptchaSlider = withInstall(_sfc_main$7);
const textEllipsisProps = buildProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    content: {
        type: String,
        required: true,
    },
    lines: {
        type: Number,
        default: 1,
    },
    ellipsisText: {
        type: String,
        default: '...',
    },
    canExpand: {
        type: Boolean,
        default: true,
    },
    expandText: {
        type: String,
        default: '展开',
    },
    collapseText: {
        type: String,
        default: '收起',
    },
});
const textEllipsisEmits = {
    [UPDATE_MODEL_EVENT]: (value) => isBoolean(value),
};
const TextEllipsisEmits = typeof textEllipsisEmits;
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
    ...{ name: 'CdxTextEllipsis' },
    __name: 'text-ellipsis',
    props: textEllipsisProps,
    emits: textEllipsisEmits,
    setup(__props, { emit: __emit }) {
        const props = __props;
        const emits = __emit;
        const slots = useSlots();
        const [, bem] = useBem('text-ellipsis');
        const { model } = useModelValue(props, false);
        const isEllipsis = ref(!!slots.default);
        const text = ref('');
        const rootRef = ref();
        const hasExpandBtn = computed(() => {
            console.log(props.canExpand, isEllipsis.value);
            return props.canExpand && isEllipsis.value;
        });
        const expandBtnText = computed(() => (model.value ? props.collapseText : props.expandText));
        const ellipsisLines = computed(() => (model.value ? 0 : props.lines));
        const cloneNode = (node, content) => {
            const copy = node.cloneNode(false);
            copy.style.width = getComputedStyle(node).width;
            copy.style.position = 'fixed';
            copy.style.zIndex = '-9999';
            copy.style.top = '-9999px';
            copy.style.left = '-9999px';
            copy.style.minHeight = 'auto';
            copy.innerHTML = content;
            document.body.appendChild(copy);
            return copy;
        };
        const parseNum = (num) => {
            const n = parseFloat(num);
            return isNaN(n) ? 0 : n;
        };
        const calcEllipsisText = (root, totalHeight, content) => {
            const len = content.length;
            const tailText = props.ellipsisText + ' ' + (hasExpandBtn.value ? expandBtnText.value : '');
            const calcDisplay = (left, right) => {
                if (right - left <= 1) {
                    return content.slice(0, left) + props.ellipsisText;
                }
                const mid = Math.round((left + right) / 2);
                root.innerText = content.slice(0, mid) + tailText;
                if (root.offsetHeight > totalHeight) {
                    return calcDisplay(left, mid);
                } else {
                    return calcDisplay(mid, right);
                }
            };
            return calcDisplay(0, len);
        };
        const calcEllipsis = () => {
            if (!rootRef.value || !props.content) return;
            const copy = cloneNode(rootRef.value, props.content);
            const { paddingTop, paddingBottom, lineHeight } = getComputedStyle(copy);
            const totalHeight =
                parseNum(paddingTop) + parseNum(paddingBottom) + parseNum(lineHeight) * (Number(props.lines) + 0.5);
            if (copy.offsetHeight > totalHeight) {
                isEllipsis.value = true;
                text.value = calcEllipsisText(copy, totalHeight, props.content);
            } else {
                isEllipsis.value = false;
                text.value = props.content;
            }
            document.body.removeChild(copy);
        };
        const toggleExpand = () => {
            model.value = !model.value;
        };
        watch(
            () => [props.content, props.ellipsisText, props.expandText, props.collapseText],
            () => {
                calcEllipsis();
            },
        );
        onMounted(() => {
            if (props.content) {
                calcEllipsis();
                window.addEventListener('resize', calcEllipsis);
            }
        });
        onBeforeUnmount(() => {
            window.removeEventListener('resize', calcEllipsis);
        });
        return (_ctx, _cache) => {
            return (
                openBlock(),
                createElementBlock(
                    'div',
                    {
                        ref_key: 'rootRef',
                        ref: rootRef,
                        class: normalizeClass$1(unref(bem).b()),
                        style: normalizeStyle$1({ [`--${unref(namespace)}-line`]: ellipsisLines.value }),
                    },
                    [
                        createElementVNode(
                            'span',
                            {
                                class: normalizeClass$1([_ctx.$slots.default && unref(bem).bem('content', 'block')]),
                            },
                            [
                                renderSlot(
                                    _ctx.$slots,
                                    'default',
                                    {
                                        isExpanded: unref(model),
                                        text: unref(model) ? props.content : text.value,
                                    },
                                    () => [
                                        createTextVNode(
                                            toDisplayString$1(unref(model) ? props.content : text.value),
                                            1,
                                        ),
                                    ],
                                ),
                            ],
                            2,
                        ),
                        hasExpandBtn.value
                            ? (openBlock(),
                              createElementBlock(
                                  'span',
                                  {
                                      key: 0,
                                      class: normalizeClass$1(unref(bem).be('expand-btn')),
                                      onClick: toggleExpand,
                                  },
                                  [
                                      renderSlot(_ctx.$slots, 'expandBtn', { isExpanded: unref(model) }, () => [
                                          createTextVNode(toDisplayString$1(expandBtnText.value), 1),
                                      ]),
                                  ],
                                  2,
                              ))
                            : createCommentVNode('', true),
                    ],
                    6,
                )
            );
        };
    },
});
const CdxTextEllipsis = withInstall(_sfc_main$6);
const textHighlightProps = buildProps({
    texts: {
        type: definePropType([Array, String]),
        default: '',
    },
    content: {
        type: String,
        required: true,
    },
    ignoreCase: {
        type: Boolean,
        default: false,
    },
    highlightTag: {
        type: String,
        default: 'span',
    },
    highlightClass: {
        type: String,
        default: '',
    },
});
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
    ...{ name: 'CdxTextHighlight' },
    __name: 'text-highlight',
    props: textHighlightProps,
    setup(__props) {
        const props = __props;
        const [, bem] = useBem('text-highlight');
        const textKeywords = computed(() => {
            if (props.texts instanceof Array) {
                return props.texts.filter((v) => !!v);
            }
            return [props.texts];
        });
        const textMatchReg = computed(
            () => new RegExp(`(${textKeywords.value.join('|')})`, `g${props.ignoreCase ? 'i' : ''}`),
        );
        const splitedContent = computed(() =>
            props.content.split(textMatchReg.value).map((text) => ({ isKey: textMatchReg.value.test(text), text })),
        );
        return (_ctx, _cache) => {
            return (
                openBlock(),
                createElementBlock(
                    'div',
                    {
                        class: normalizeClass$1(unref(bem).b()),
                    },
                    [
                        (openBlock(true),
                        createElementBlock(
                            Fragment,
                            null,
                            renderList(splitedContent.value, (text) => {
                                return (
                                    openBlock(),
                                    createElementBlock(
                                        Fragment,
                                        null,
                                        [
                                            text.isKey
                                                ? renderSlot(
                                                      _ctx.$slots,
                                                      'highlight',
                                                      {
                                                          key: 0,
                                                          text: text.text,
                                                      },
                                                      () => [
                                                          (openBlock(),
                                                          createBlock(
                                                              resolveDynamicComponent(props.highlightTag),
                                                              {
                                                                  class: normalizeClass$1([
                                                                      unref(bem).be('highlight'),
                                                                      _ctx.highlightClass,
                                                                  ]),
                                                              },
                                                              {
                                                                  default: withCtx(() => [
                                                                      createTextVNode(toDisplayString$1(text.text), 1),
                                                                  ]),
                                                                  _: 2,
                                                              },
                                                              1032,
                                                              ['class'],
                                                          )),
                                                      ],
                                                  )
                                                : renderSlot(
                                                      _ctx.$slots,
                                                      'default',
                                                      {
                                                          key: 1,
                                                          text: text.text,
                                                      },
                                                      () => [createTextVNode(toDisplayString$1(text.text), 1)],
                                                  ),
                                        ],
                                        64,
                                    )
                                );
                            }),
                            256,
                        )),
                    ],
                    2,
                )
            );
        };
    },
});
const CdxTextHighlight = withInstall(_sfc_main$5);
const modelProps = buildProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    width: {
        type: String,
        default: '50%',
    },
    maskClose: {
        type: Boolean,
        default: true,
    },
    fullscreen: {
        type: Boolean,
        default: false,
    },
    destroyOnClose: {
        type: Boolean,
        default: true,
    },
});
const modelEmits = {
    [UPDATE_MODEL_EVENT]: (value) => isBoolean(value),
    close: () => true,
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
    ...{ name: 'CdxModel' },
    __name: 'model',
    props: modelProps,
    emits: modelEmits,
    setup(__props, { emit: __emit }) {
        const props = __props;
        const emits = __emit;
        const [, bem] = useBem('model');
        const { model } = useModelValue(props, false);
        const { nextZIndex } = useZIndex();
        const contentRended = ref(model.value);
        const zIndex2 = ref(nextZIndex());
        const disabledTeleport = computed(() => !props.fullscreen);
        const contentStyle = computed(() => {
            const modelStyle = {};
            if (props.width) {
                modelStyle[`--${bem.b()}-width`] = props.width;
            }
            return modelStyle;
        });
        const overlayStyle = computed(() => ({
            zIndex: disabledTeleport.value ? 0 : zIndex2.value,
        }));
        const close = () => {
            if (!props.maskClose) return;
            model.value = false;
        };
        watch(model, () => {
            if (model.value) {
                zIndex2.value = nextZIndex();
                contentRended.value = true;
            } else {
                props.destroyOnClose && (contentRended.value = false);
                emits('close');
            }
        });
        console.log(props);
        return (_ctx, _cache) => {
            return (
                openBlock(),
                createBlock(
                    Teleport,
                    {
                        to: 'body',
                        disabled: disabledTeleport.value,
                    },
                    [
                        createVNode(
                            Transition,
                            {
                                name: unref(bem).ns('fade'),
                                appear: '',
                            },
                            {
                                default: withCtx(() => [
                                    createVNode(
                                        unref(CdxOverlay),
                                        {
                                            modelValue: unref(model),
                                            'onUpdate:modelValue':
                                                _cache[0] ||
                                                (_cache[0] = ($event) =>
                                                    isRef(model) ? (model.value = $event) : null),
                                            onClick: close,
                                            fullscreen: _ctx.fullscreen,
                                            style: normalizeStyle$1(overlayStyle.value),
                                        },
                                        {
                                            default: withCtx(() => [
                                                contentRended.value
                                                    ? (openBlock(),
                                                      createElementBlock(
                                                          'div',
                                                          {
                                                              key: 0,
                                                              class: normalizeClass$1(unref(bem).b()),
                                                              style: normalizeStyle$1(contentStyle.value),
                                                          },
                                                          [
                                                              createElementVNode(
                                                                  'div',
                                                                  {
                                                                      class: normalizeClass$1(unref(bem).be('content')),
                                                                  },
                                                                  [
                                                                      _ctx.$slots.header
                                                                          ? (openBlock(),
                                                                            createElementBlock(
                                                                                'div',
                                                                                {
                                                                                    key: 0,
                                                                                    class: normalizeClass$1(
                                                                                        unref(bem).be('header'),
                                                                                    ),
                                                                                },
                                                                                [renderSlot(_ctx.$slots, 'header')],
                                                                                2,
                                                                            ))
                                                                          : createCommentVNode('', true),
                                                                      createElementVNode(
                                                                          'div',
                                                                          {
                                                                              class: normalizeClass$1(
                                                                                  unref(bem).be('body'),
                                                                              ),
                                                                          },
                                                                          [renderSlot(_ctx.$slots, 'default')],
                                                                          2,
                                                                      ),
                                                                      _ctx.$slots.footer
                                                                          ? (openBlock(),
                                                                            createElementBlock(
                                                                                'div',
                                                                                {
                                                                                    key: 1,
                                                                                    class: normalizeClass$1(
                                                                                        unref(bem).be('footer'),
                                                                                    ),
                                                                                },
                                                                                [renderSlot(_ctx.$slots, 'footer')],
                                                                                2,
                                                                            ))
                                                                          : createCommentVNode('', true),
                                                                  ],
                                                                  2,
                                                              ),
                                                          ],
                                                          6,
                                                      ))
                                                    : createCommentVNode('', true),
                                            ]),
                                            _: 3,
                                        },
                                        8,
                                        ['modelValue', 'fullscreen', 'style'],
                                    ),
                                ]),
                                _: 3,
                            },
                            8,
                            ['name'],
                        ),
                    ],
                    8,
                    ['disabled'],
                )
            );
        };
    },
});
const resolveOptions = (options) => {
    var _a, _b, _c;
    let target;
    if (isString(options.target)) {
        target = (_a = document.querySelector(options.target)) != null ? _a : document.body;
    } else {
        target = options.target || document.body;
    }
    return {
        width: options.width || '50%',
        fullscreen: isUndefined(options.fullscreen) ? (target === document.body ? true : false) : options.fullscreen,
        maskClose: (_b = options.maskClose) != null ? _b : true,
        destroyOnClose: (_c = options.destroyOnClose) != null ? _c : true,
        target,
        header: options.header,
        body: options.body,
        footer: options.footer,
    };
};
let unmountTimer = setTimeout(() => {}, 0);
const createModelInstance = (options) => {
    const { target, header, body, footer, ...props } = resolveOptions(options);
    const model = defineComponent({
        name: 'CdxModel',
        setup() {
            return () =>
                h(
                    _sfc_main$4,
                    {
                        ...props,
                        modelValue: data.visible,
                        'onUpdate:modelValue': (value) => {
                            data.visible = value;
                        },
                    },
                    {
                        header: header ? () => header : null,
                        default: body ? () => body : null,
                        footer: footer ? () => footer : null,
                    },
                );
        },
    });
    const data = reactive({
        visible: true,
    });
    const close = () => {
        clearTimeout(unmountTimer);
        unmountTimer = setTimeout(() => {
            if (vm) {
                vm.$el.remove();
                modelInstance.unmount();
            }
        }, 300);
        data.visible = false;
    };
    const modelInstance = createApp(model, {
        ...props,
        onClose: close,
    });
    const container = document.createElement('div');
    const vm = modelInstance.mount(container);
    Array.from(container.children).map((child) => target.appendChild(child));
    data.visible = true;
    return {
        close,
    };
};
const CdxModel = withInstall(_sfc_main$4, {
    service: createModelInstance,
});
const countToProps = buildProps({
    startValue: {
        type: Number,
        default: 0,
    },
    endValue: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        default: 2e3,
    },
    decimal: {
        type: Number,
    },
    autoStart: {
        type: Boolean,
        default: true,
    },
    animation: {
        type: Boolean,
        default: false,
    },
    animationDuration: {
        type: Number,
        default: 2e3,
    },
});
const countToEmits = {
    finish: () => true,
    [CHANGE_EVENT]: (value) => isNumber(value),
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
    ...{ name: 'CdxCountTo' },
    __name: 'count-to',
    props: countToProps,
    emits: countToEmits,
    setup(__props, { expose: __expose, emit: __emit }) {
        const props = __props;
        const emits = __emit;
        const [, bem] = useBem('count-to');
        let startTime = 0;
        const currentValue = ref(props.startValue);
        const animateId = ref();
        const durationTime = ref(props.duration);
        const lastDurationTime = ref(0);
        const startValue = ref(props.startValue);
        const isFinished = ref(false);
        const animateDisplayValue = ref([]);
        const resetting = ref(false);
        const isCountDown = computed(() => props.startValue > props.endValue);
        const intergerCount = computed(() =>
            Math.max(getIntegerLength(props.startValue), getIntegerLength(props.endValue)),
        );
        const decimalCount = computed(
            () => props.decimal || Math.max(getDecimalLength(props.startValue), getDecimalLength(props.endValue)),
        );
        const displayValue = computed(() => {
            const strNum = toStringNumber(Math.abs(currentValue.value));
            let [integer, deciaml = ''] = strNum.split('.');
            integer = integer.padStart(intergerCount.value, '0');
            deciaml = deciaml.padEnd(decimalCount.value, '0').slice(0, decimalCount.value);
            return (currentValue.value < 0 ? '-' : '') + integer + (deciaml ? `.${deciaml}` : '');
        });
        const inTransition = computed(() => !isFinished.value && !resetting.value);
        const transitionDuration = computed(() => ({
            [bem.cv('count-transition-duration')]: `${inTransition.value ? props.animationDuration : 0}ms`,
        }));
        const stepFn = (time, beginValue, changeValue, duration) => {
            return (changeValue * (-Math.pow(2, (-10 * time) / duration) + 1) * 1024) / 1023 + beginValue;
        };
        const count = (time) => {
            if (!startTime) {
                startTime = time;
            }
            const progress = time - startTime;
            lastDurationTime.value = durationTime.value - progress;
            const currentNum = stepFn(
                progress,
                startValue.value,
                props.endValue - startValue.value,
                durationTime.value,
            );
            currentValue.value = Math[isCountDown.value ? 'max' : 'min'](props.endValue, currentNum);
            emits(CHANGE_EVENT, currentValue.value);
            if (progress < durationTime.value && currentValue.value !== props.endValue) {
                animateId.value = raf(count);
            } else {
                if (!props.animation) {
                    finish();
                }
            }
        };
        const startCount = () => {
            if (animateId.value) return;
            animateId.value = raf(count);
            isFinished.value = false;
            transitionEndCount = 0;
        };
        const stopCount = () => {
            if (!animateId.value) return;
            animateId.value && caf(animateId.value);
            animateId.value = 0;
            startTime = 0;
            durationTime.value = lastDurationTime.value;
            startValue.value = currentValue.value;
            updateAnimateDisplayValue();
        };
        const reset = () => {
            resetting.value = true;
            stopCount();
            durationTime.value = props.duration;
            currentValue.value = props.startValue;
            startValue.value = props.startValue;
            lastDurationTime.value = 0;
            isFinished.value = false;
            startTime = 0;
            transitionEndCount = 0;
            resetAnimateDisplayValue();
            setTimeout(() => {
                resetting.value = false;
            }, 0);
        };
        const finish = () => {
            isFinished.value = true;
            emits('finish');
        };
        const resetAnimateDisplayValue = () => {
            animateDisplayValue.value = new Array(
                (currentValue.value < 0 ? 1 : 0) +
                    intergerCount.value +
                    (decimalCount.value ? 1 + decimalCount.value : 0),
            )
                .fill(0)
                .map((_, i) => new Array('0', displayValue.value[i]));
        };
        const updateAnimateDisplayValue = () => {
            if (!animateDisplayValue.value.length) {
                resetAnimateDisplayValue();
            }
            displayValue.value.split('').map((v, i) => {
                let curValues = animateDisplayValue.value[i];
                if (!curValues) {
                    curValues = ['0'];
                    animateDisplayValue.value[i] = curValues;
                }
                if (curValues[curValues.length - 1] !== v) {
                    curValues.push(v);
                }
            });
            animateDisplayValue.value = animateDisplayValue.value.slice(0, displayValue.value.length);
        };
        const clearAnimateValue = () => {
            animateDisplayValue.value = animateDisplayValue.value.map((v) => ['0'].concat(v.slice(-1)));
        };
        let transitionEndCount = 0;
        const handleTransitionEnd = () => {
            nextTick(() => {
                transitionEndCount += 1;
                if (transitionEndCount >= animateDisplayValue.value.filter((v) => v.length > 2).length) {
                    clearAnimateValue();
                    finish();
                }
            });
        };
        watch(
            () => [props.startValue, props.endValue, props.duration],
            () => {
                reset();
                if (props.autoStart) {
                    startCount();
                }
            },
        );
        watch(displayValue, updateAnimateDisplayValue, { immediate: true });
        onMounted(() => {
            props.autoStart && startCount();
        });
        onBeforeUnmount(() => {
            stopCount();
        });
        __expose({
            reset,
            startCount,
            stopCount,
        });
        return (_ctx, _cache) => {
            return (
                openBlock(),
                createElementBlock(
                    'span',
                    {
                        class: normalizeClass$1(unref(bem).b()),
                    },
                    [
                        renderSlot(_ctx.$slots, 'prefix'),
                        renderSlot(_ctx.$slots, 'default', { value: currentValue.value }, () => [
                            !_ctx.animation
                                ? (openBlock(),
                                  createElementBlock(
                                      Fragment,
                                      { key: 0 },
                                      [createTextVNode(toDisplayString$1(displayValue.value), 1)],
                                      64,
                                  ))
                                : (openBlock(),
                                  createElementBlock(
                                      'div',
                                      {
                                          key: 1,
                                          class: normalizeClass$1(unref(bem).be('animate')),
                                          style: normalizeStyle$1(transitionDuration.value),
                                          onTransitionend: handleTransitionEnd,
                                      },
                                      [
                                          (openBlock(true),
                                          createElementBlock(
                                              Fragment,
                                              null,
                                              renderList(animateDisplayValue.value, (strs) => {
                                                  return (
                                                      openBlock(),
                                                      createElementBlock(
                                                          'span',
                                                          {
                                                              class: normalizeClass$1(unref(bem).be('animate-wrapper')),
                                                              style: normalizeStyle$1({
                                                                  transform: `translateY(-${strs.length - 1}em)`,
                                                              }),
                                                          },
                                                          [
                                                              (openBlock(true),
                                                              createElementBlock(
                                                                  Fragment,
                                                                  null,
                                                                  renderList(strs, (s) => {
                                                                      return (
                                                                          openBlock(),
                                                                          createElementBlock(
                                                                              'span',
                                                                              null,
                                                                              toDisplayString$1(s),
                                                                              1,
                                                                          )
                                                                      );
                                                                  }),
                                                                  256,
                                                              )),
                                                          ],
                                                          6,
                                                      )
                                                  );
                                              }),
                                              256,
                                          )),
                                      ],
                                      38,
                                  )),
                        ]),
                        renderSlot(_ctx.$slots, 'suffix'),
                    ],
                    2,
                )
            );
        };
    },
});
const CdxCountTo = withInstall(_sfc_main$3);
const collapseProps = buildProps({
    modelValue: {
        type: definePropType(Array),
        default: () => [],
    },
});
const collapseEmits = {
    [UPDATE_MODEL_EVENT]: (value) => isArray(value),
    [CHANGE_EVENT]: (value) => isArray(value),
};
const collapseContextKey = Symbol('collapseContextKey');
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
    ...{ name: 'CdxCollapse' },
    __name: 'collapse',
    props: collapseProps,
    emits: collapseEmits,
    setup(__props, { emit: __emit }) {
        const props = __props;
        const emits = __emit;
        const [, bem] = useBem('collapse');
        const activeNames = ref(props.modelValue);
        const setActiveNames = (value) => {
            activeNames.value = value;
            emits(UPDATE_MODEL_EVENT, value);
            emits(CHANGE_EVENT, value);
        };
        const handleItemClick = (name) => {
            const _activeNames = [...activeNames.value];
            const index = _activeNames.indexOf(name);
            if (index > -1) {
                _activeNames.splice(index, 1);
            } else {
                _activeNames.push(name);
            }
            setActiveNames(_activeNames);
        };
        provide(collapseContextKey, {
            activeNames,
            handleItemClick,
        });
        return (_ctx, _cache) => {
            return (
                openBlock(),
                createElementBlock(
                    'div',
                    {
                        class: normalizeClass$1(unref(bem).b()),
                    },
                    [renderSlot(_ctx.$slots, 'default')],
                    2,
                )
            );
        };
    },
});
const collapseItemProps = buildProps({
    name: {
        type: definePropType([String, Number]),
        default: null,
    },
    title: {
        type: String,
        default: '',
    },
    expend: {
        type: Boolean,
        default: true,
    },
});
const collapseItemEmits = {
    'update:expend': (value) => isBoolean(value),
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
    ...{ name: 'CdxCollapseItem' },
    __name: 'collapse-item',
    props: collapseItemProps,
    emits: collapseItemEmits,
    setup(__props, { emit: __emit }) {
        const props = __props;
        const emits = __emit;
        const collapseContext = inject(collapseContextKey, void 0);
        const [, bem] = useBem('collapse-item');
        const isActive = computed(() =>
            collapseContext ? collapseContext.activeNames.value.includes(props.name) : props.expend,
        );
        const handleItemClick = () => {
            if (collapseContext) {
                collapseContext.handleItemClick(props.name);
            } else {
                emits('update:expend', !props.expend);
            }
        };
        return (_ctx, _cache) => {
            return (
                openBlock(),
                createElementBlock(
                    'div',
                    {
                        class: normalizeClass$1(unref(bem).b()),
                    },
                    [
                        createElementVNode(
                            'button',
                            {
                                class: normalizeClass$1(unref(bem).be('header')),
                                tabindex: '0',
                                onClick: handleItemClick,
                            },
                            toDisplayString$1(_ctx.title),
                            3,
                        ),
                        createVNode(unref(CdxCollapseTransition), null, {
                            default: withCtx(() => [
                                isActive.value
                                    ? (openBlock(),
                                      createElementBlock(
                                          'div',
                                          {
                                              key: 0,
                                              class: normalizeClass$1(unref(bem).be('content')),
                                          },
                                          [renderSlot(_ctx.$slots, 'default')],
                                          2,
                                      ))
                                    : createCommentVNode('', true),
                            ]),
                            _: 3,
                        }),
                    ],
                    2,
                )
            );
        };
    },
});
const CdxCollapse = withInstall(_sfc_main$2);
const CdxCollapseItem = withInstall(_sfc_main$1);
const _sfc_main = /* @__PURE__ */ defineComponent({
    ...{ name: 'CdxCollapseTransition' },
    __name: 'collapse-transition',
    setup(__props) {
        const [, bem] = useBem('collapse-transition');
        const elStyle = {};
        const resetStyle = (el) => {
            Object.assign(el.style, {
                ...elStyle,
                maxHeight: null,
                boxSizing: null,
            });
        };
        const events = {
            beforeEnter(el) {
                elStyle.paddingTop = el.style.paddingTop;
                elStyle.paddingBottom = el.style.paddingBottom;
                elStyle.marginTop = el.style.marginTop;
                elStyle.marginBottom = el.style.marginBottom;
                elStyle.boxSizing = el.style.boxSizing;
                Object.assign(el.style, {
                    maxHeight: '0',
                    marginTop: '0',
                    marginBottom: '0',
                    paddingTop: '0',
                    paddingBottom: '0',
                    boxSizing: 'content-box',
                });
            },
            enter(el) {
                elStyle.overflow = el.style.overflow;
                Object.assign(el.style, {
                    ...elStyle,
                    maxHeight: el.scrollHeight ? `${el.scrollHeight}px` : '0',
                    boxSizing: 'content-box',
                    overflow: 'hidden',
                });
            },
            afterEnter(el) {
                Object.assign(el.style, {
                    maxHeight: null,
                    overflow: elStyle.overflow,
                });
            },
            enterCancelled(el) {
                resetStyle(el);
            },
            beforeLeave(el) {
                elStyle.paddingTop = el.style.paddingTop;
                elStyle.paddingBottom = el.style.paddingBottom;
                elStyle.overflow = el.style.overflow;
                elStyle.marginTop = el.style.marginTop;
                elStyle.marginBottom = el.style.marginBottom;
                elStyle.boxSizing = el.style.boxSizing;
                Object.assign(el.style, {
                    maxHeight: `${el.scrollHeight}px` || '',
                    boxSizing: 'content-box',
                    overflow: 'hidden',
                });
            },
            leave(el) {
                if (el.scrollHeight !== 0) {
                    Object.assign(el.style, {
                        maxHeight: '0',
                        paddingTop: '0',
                        paddingBottom: '0',
                        marginTop: '0',
                        marginBottom: '0',
                    });
                }
            },
            afterLeave(el) {
                resetStyle(el);
            },
            leaveCancelled(el) {
                resetStyle(el);
            },
        };
        return (_ctx, _cache) => {
            return (
                openBlock(),
                createBlock(
                    Transition,
                    mergeProps(
                        {
                            name: unref(bem).b(),
                        },
                        toHandlers(events),
                    ),
                    {
                        default: withCtx(() => [renderSlot(_ctx.$slots, 'default')]),
                        _: 3,
                    },
                    16,
                    ['name'],
                )
            );
        };
    },
});
const CdxCollapseTransition = withInstall(_sfc_main);
const Components = [
    CdxDrawer,
    CdxOverlay,
    CdxElementSelect,
    CdxElementSelectItem,
    CdxIcon,
    CdxLoading,
    CdxLoadingDirective,
    CdxCaptcha,
    CdxCaptchaSlider,
    CdxTextEllipsis,
    CdxTextHighlight,
    CdxModel,
    CdxCountTo,
    CdxCollapse,
    CdxCollapseItem,
    CdxCollapseTransition,
];
const makeInstaller = (components = []) => {
    const install2 = (app) => {
        if (app[INSTALLED_KEY]) return;
        app[INSTALLED_KEY] = true;
        components.forEach((c) => app.use(c));
    };
    return {
        install: install2,
    };
};
const makeInstall = makeInstaller(Components);
const toKebabCase = (key) => {
    const result = key.replace(/([A-Z])/g, ' $1').trim();
    return result.split(' ').join('-').toLowerCase();
};
const resolveComponent = (name) => {
    if (!name.match(/^Cdx[A-Z]/)) return;
    const partialName = toKebabCase(name.slice(3));
    return {
        name,
        from: `cdx-component/es`,
        sideEffects: [
            `cdx-component/es/components/base/style/index`,
            `cdx-component/es/components/${partialName}/style/index`,
        ],
    };
};
const resolveDirective = async (name) => {
    const directiveMap = {
        Loading: {},
    };
    if (!directiveMap[name]) return;
    const partialName = name.toLowerCase();
    return {
        name: `Cdx${name}Directive`,
        from: `cdx-component/es`,
        sideEffects: [
            `cdx-component/es/components/base/style/index`,
            `cdx-component/es/components/${partialName}/style/index`,
        ],
    };
};
const CdxComponentResolver = () => [
    {
        type: 'component',
        resolve: resolveComponent,
    },
    {
        type: 'directive',
        resolve: resolveDirective,
    },
];
const install = makeInstall.install;
export {
    CHANGE_EVENT,
    CaptchType,
    CaptchaSliderEmits,
    CdxCaptcha,
    CdxCaptchaSlider,
    CdxCollapse,
    CdxCollapseItem,
    CdxCollapseTransition,
    CdxComponentResolver,
    CdxCountTo,
    CdxDrawer,
    CdxElementSelect,
    CdxElementSelectItem,
    CdxIcon,
    CdxLoading,
    CdxLoadingDirective,
    CdxModel,
    CdxOverlay,
    CdxTextEllipsis,
    CdxTextHighlight,
    CheckStatus,
    INSTALLED_KEY,
    LOADING_INSTANCE,
    TextEllipsisEmits,
    UPDATE_MODEL_EVENT,
    buildProp,
    buildProps,
    cacheFunction,
    caf,
    captchaEmits,
    captchaProps,
    captchaSliderEmits,
    captchaSliderProps,
    collapseEmits,
    collapseItemEmits,
    collapseItemProps,
    collapseProps,
    countToEmits,
    countToProps,
    createBEM,
    createNamespace,
    makeInstall as default,
    definePropType,
    drawerEmits,
    drawerProps,
    elementSelectEmits,
    elementSelectItemEmits,
    elementSelectItemProps,
    elementSelectProps,
    elementSelectValueType,
    ensureArray,
    generateRandomColor,
    getDecimalLength,
    getIntegerLength,
    getScrollBarWidth,
    install,
    isArray,
    isBoolean,
    isFunction,
    isNumber,
    isObject,
    isString,
    isUndefined,
    loadingProps,
    modelEmits,
    modelProps,
    namespace,
    overlayEmits,
    overlayProps,
    pick,
    precisionNumber,
    raf,
    selectContextKey,
    textEllipsisEmits,
    textEllipsisProps,
    textHighlightProps,
    toFixed,
    toStringNumber,
    useBem,
    useLockScroll,
    useModelValue,
    useSameClickTarget,
    useSlide,
    useSupportTouch,
    useZIndex,
    withInstall,
    withInstallDirective,
};
//# sourceMappingURL=index.esm.js.map
