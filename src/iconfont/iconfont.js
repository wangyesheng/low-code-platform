!(function (e) {
  var t,
    a,
    n,
    o,
    i,
    c =
      '<svg><symbol id="icon-delete" viewBox="0 0 1024 1024"><path d="M96 320a32 32 0 1 1 0-64h832a32 32 0 0 1 0 64H96z m736 0h64v448a160 160 0 0 1-160 160H288a160 160 0 0 1-160-160V320h64v96H128v-96h64v448a96 96 0 0 0 96 96h448a96 96 0 0 0 96-96V320z m-512 112a32 32 0 0 1 64 0v320a32 32 0 0 1-64 0v-320z m320 0a32 32 0 0 1 64 0v320a32 32 0 0 1-64 0v-320zM288 256H224V192a96 96 0 0 1 96-96h384a96 96 0 0 1 96 96v64h-64V224h64v32h-64V192a32 32 0 0 0-32-32H320a32 32 0 0 0-32 32v64z"  ></path></symbol><symbol id="icon-save" viewBox="0 0 1024 1024"><path d="M925.248 356.928l-258.176-258.176a64 64 0 0 0-45.248-18.752H144a64 64 0 0 0-64 64v736a64 64 0 0 0 64 64h736a64 64 0 0 0 64-64V402.176a64 64 0 0 0-18.752-45.248zM288 144h192V256H288V144z m448 736H288V736h448v144z m144 0H800V704a32 32 0 0 0-32-32H256a32 32 0 0 0-32 32v176H144v-736H224V288a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32V144h77.824l258.176 258.176V880z"  ></path></symbol><symbol id="icon-redo" viewBox="0 0 1024 1024"><path d="M684.8 326.4l194.816 170.24-194.56 168.96v-9.984a124.672 124.672 0 0 0-125.44-124.16 1746.432 1746.432 0 0 0-220.672 13.568 703.744 703.744 0 0 0-71.168 13.312 757.504 757.504 0 0 1 310.016-116.736 124.928 124.928 0 0 0 107.008-116.224M604.416 128a22.016 22.016 0 0 0-22.016 21.76v170.752a21.504 21.504 0 0 1-18.688 21.504c-92.672 13.056-502.528 90.368-563.2 456.448a22.272 22.272 0 0 0 22.016 25.6 20.224 20.224 0 0 0 16.128-8.192c49.408-62.72 144.64-144.896 314.112-167.936a1627.904 1627.904 0 0 1 207.616-12.544 22.016 22.016 0 0 1 22.016 21.76V844.8a21.504 21.504 0 0 0 21.76 21.76 20.224 20.224 0 0 0 14.08-5.376L1016.576 512a21.76 21.76 0 0 0 0-32.768L618.496 132.608a22.016 22.016 0 0 0-14.08-4.608z"  ></path></symbol><symbol id="icon-ctrlZ" viewBox="0 0 1024 1024"><path d="M396.544 135.968L73.28 459.2a44.8 44.8 0 0 0 0 63.36l323.264 323.264a35.2 35.2 0 0 0 24.896 10.304l3.84-0.192a35.2 35.2 0 0 0 31.36-35.008l-0.032-189.024 10.656 0.416c146.08 7.2 278.304 80.256 359.68 196.032l47.36 67.456 10.56-81.792c2.272-17.856 3.424-35.936 3.424-54.144l-0.096-9.792c-5.216-227.968-191.84-412.096-424.672-422.144l-6.88-0.224V160.832a35.2 35.2 0 0 0-60.096-24.864z m-3.904 94.368v163.04l33.408-1.44c5.76-0.256 11.584-0.384 17.408-0.384l9.696 0.096c189.888 4.608 345.024 143.552 368.16 321.92l1.152 10.304-2.496-2.56c-97.664-96.768-232.192-153.536-376.512-153.536-6.688 0-13.344 0.096-19.968 0.32l-30.848 1.152v182.176L132.096 490.88l260.544-260.544z"  ></path></symbol></svg>',
    l = (l = document.getElementsByTagName("script"))[
      l.length - 1
    ].getAttribute("data-injectcss"),
    d = function (e, t) {
      t.parentNode.insertBefore(e, t);
    };
  if (l && !e.__iconfont__svg__cssinject__) {
    e.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        "<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>"
      );
    } catch (e) {
      console && console.log(e);
    }
  }
  function s() {
    i || ((i = !0), n());
  }
  function h() {
    try {
      o.documentElement.doScroll("left");
    } catch (e) {
      return void setTimeout(h, 50);
    }
    s();
  }
  (t = function () {
    var e,
      t = document.createElement("div");
    (t.innerHTML = c),
      (c = null),
      (t = t.getElementsByTagName("svg")[0]) &&
        (t.setAttribute("aria-hidden", "true"),
        (t.style.position = "absolute"),
        (t.style.width = 0),
        (t.style.height = 0),
        (t.style.overflow = "hidden"),
        (t = t),
        (e = document.body).firstChild ? d(t, e.firstChild) : e.appendChild(t));
  }),
    document.addEventListener
      ? ~["complete", "loaded", "interactive"].indexOf(document.readyState)
        ? setTimeout(t, 0)
        : ((a = function () {
            document.removeEventListener("DOMContentLoaded", a, !1), t();
          }),
          document.addEventListener("DOMContentLoaded", a, !1))
      : document.attachEvent &&
        ((n = t),
        (o = e.document),
        (i = !1),
        h(),
        (o.onreadystatechange = function () {
          "complete" == o.readyState && ((o.onreadystatechange = null), s());
        }));
})(window);
