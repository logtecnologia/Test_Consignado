/*
 * Thickbox 3.1 - One Box To Rule Them All.
 * By Cody Lindley (http://www.codylindley.com)
 * Copyright (c) 2007 cody lindley
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 */
function tb_init(e) {
    $(e).click(function() {
        var e = this.title || this.name || null;
        var t = this.href || this.alt;
        var n = this.rel || false;
        tb_show(e, t, n);
        this.blur();
        return false
    })
}

function tb_show(e, t, n, r) {   
    try {
        if (isObject(r)) {
            $ = r.window.$
        }
        if (typeof document.body.style.maxHeight === "undefined") {
            $("body", "html").css({
                height: "100%",
                width: "100%"
            });
            $("html").css("overflow", "hidden");
            if (document.getElementById("TB_HideSelect") === null) {
                $("body").append("<div id='TB_HideSelect'></div><div id='TB_overlay'></div><div id='TB_window'></div>");
                $("#TB_window").click(tb_remove)
            }
        } else {
            if (document.getElementById("TB_overlay") === null) {
                $("body").append("<div id='TB_overlay'></div><div id='TB_window'></div>");
                $("#TB_window").click(tb_remove)
            }
        }
        if (tb_detectMacXFF()) {
            $("#TB_overlay").addClass("TB_overlayMacFFBGHack")
        } else {
            $("#TB_overlay").addClass("TB_overlayBG")
        }
        if (e === null) {
            e = ""
        }
        $("body").addClass("tb-open");
        $("body").append("<div id='TB_load'><img src='" + imgLoader.src + "' /></div>");
        $("#TB_load").show();
        var i;
        if (t.indexOf("?") !== -1) {
            i = t.substr(0, t.indexOf("?"))
        } else {
            i = t
        }
        var s = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
        var o = i.toLowerCase().match(s);
        if (o === ".jpg" || o === ".jpeg" || o === ".png" || o === ".gif" || o === ".bmp") {
            TB_PrevCaption = "";
            TB_PrevURL = "";
            TB_PrevHTML = "";
            TB_NextCaption = "";
            TB_NextURL = "";
            TB_NextHTML = "";
            TB_imageCount = "";
            TB_FoundURL = false;
            if (n) {
                TB_TempArray = $("a[@rel=" + n + "]").get();
                for (TB_Counter = 0; TB_Counter < TB_TempArray.length && TB_NextHTML === ""; TB_Counter++) {
                    var u = TB_TempArray[TB_Counter].href.toLowerCase().match(s);
                    if (!(TB_TempArray[TB_Counter].href === t)) {
                        if (TB_FoundURL) {
                            TB_NextCaption = TB_TempArray[TB_Counter].title;
                            TB_NextURL = TB_TempArray[TB_Counter].href;
                            TB_NextHTML = "<span id='TB_next'>&nbsp;&nbsp;<a href='#'>Next &gt;</a></span>"
                        } else {
                            TB_PrevCaption = TB_TempArray[TB_Counter].title;
                            TB_PrevURL = TB_TempArray[TB_Counter].href;
                            TB_PrevHTML = "<span id='TB_prev'>&nbsp;&nbsp;<a href='#'>&lt; Prev</a></span>"
                        }
                    } else {
                        TB_FoundURL = true;
                        TB_imageCount = "Image " + (TB_Counter + 1) + " of " + TB_TempArray.length
                    }
                }
            }
            imgPreloader = new Image;
            imgPreloader.onload = function() {
                imgPreloader.onload = null;
                var r = tb_getPageSize();
                var i = r[0] - 150;
                var s = r[1] - 150;
                var o = imgPreloader.width;
                var u = imgPreloader.height;
                if (o > i) {
                    u = u * (i / o);
                    o = i;
                    if (u > s) {
                        o = o * (s / u);
                        u = s
                    }
                } else if (u > s) {
                    o = o * (s / u);
                    u = s;
                    if (o > i) {
                        u = u * (i / o);
                        o = i
                    }
                }
                TB_WIDTH = o + 30;
                TB_HEIGHT = u + 60;
                $("#TB_window").append("<a href='' id='TB_ImageOff' title='Fechar'><img id='TB_Image' src='" + t + "' alt='" + e + "'/></a>" + "<div id='TB_caption'>" + e + "<div id='TB_secondLine'>" + TB_imageCount + TB_PrevHTML + TB_NextHTML + "</div></div><div id='TB_closeWindow' class='icon-close'></div>");
                $("#TB_closeWindowButton").click(tb_remove);
                if (!(TB_PrevHTML === "")) {
                    function a() {
                        if ($(document).unbind("click", a)) {
                            $(document).unbind("click", a)
                        }
                        $("#TB_window").remove();
                        $("body").append("<div id='TB_window'></div>");
                        tb_show(TB_PrevCaption, TB_PrevURL, n);
                        return false;
                    }
                    $("#TB_prev").click(a);
                }
                if (!(TB_NextHTML === "")) {
                    function f() {
                        $("#TB_window").remove();
                        $("body").append("<div id='TB_window'></div>");
                        tb_show(TB_NextCaption, TB_NextURL, n);
                        return false;
                    }
                    $("#TB_next").click(f)
                }

                document.onkeydown = function (e) {
                    if (e === null) {
                        keycode = event.keyCode;
                    } else {
                        keycode = e.which;
                    }

                    if (keycode === 27) {
                        tb_remove();
                    } else if (keycode === 190) {
                        if (!(TB_NextHTML === "")) {
                            document.onkeydown = "";
                            f();
                        }
                    } else if (keycode === 188) {
                        if (!(TB_PrevHTML === "")) {
                            document.onkeydown = "";
                            a();
                        }
                    }
                };
                $("#TB_load").remove();
                $("#TB_ImageOff").click(tb_remove);
                $("#TB_window").addClass("show");
            };
            imgPreloader.src = t
        } else {
            var a = t.replace(/^[^\?]+\??/, "");
            var f = tb_parseQuery(a);
            TB_WIDTH = f["width"] * 1 + 30 || 630;
            TB_HEIGHT = f["height"] * 1 + 40 || 440;
            ajaxContentW = TB_WIDTH - 30;
            ajaxContentH = TB_HEIGHT - 45;
            if (t.indexOf("TB_iframe") !== -1) {
                urlNoQuery = t.split("&TB_");
                $("#TB_iframeContent").remove();
                if (f["modal"] != "true") {
                    $("#TB_window").append("<div id='TB_content'><div id='TB_header'><div id='TB_ajaxWindowTitle'>" + e + "</div><div id='TB_closeAjaxWindow' class='icon-close'></div></div><div id='TB_body'><iframe frameborder='0' hspace='0' src='" + urlNoQuery[0] + "' id='TB_iframeContent' name='TB_iframeContent" + Math.round(Math.random() * 1e3) + "' onload='tb_showIframe()'></iframe></div></div>")
                } else {
                    $("#TB_window").append("<div id='TB_content'><div id='TB_header'><div id='TB_ajaxWindowTitle'>" + e + "</div><div id='TB_closeAjaxWindow' class='icon-close'></div></div><div id='TB_body'><iframe frameborder='0' hspace='0' src='" + urlNoQuery[0] + "' id='TB_iframeContent' name='TB_iframeContent" + Math.round(Math.random() * 1e3) + "' onload='tb_showIframe()'></iframe></div></div>").show()
                }
            } else {
                if ($("#TB_window").hasClass("show")) {
                    if (f["modal"] !== "true") {
                        $("#TB_window").append("<div id='TB_content'><div id='TB_header'><div id='TB_ajaxWindowTitle'>" + e + "</div><div id='TB_closeAjaxWindow' class='icon-close'></div></div><div id='TB_body'><div id='TB_ajaxContent'></div></div></div>")
                    } else {
                        $("#TB_overlay").unbind();
                        $("#TB_window").append("<div id='TB_content'><div id='TB_body'><div id='TB_ajaxContent' class='TB_modal'></div></div></div>");
                    }
                } else {
                    $("#TB_ajaxContent")[0].style.width = ajaxContentW + "px";
                    $("#TB_ajaxContent")[0].style.height = ajaxContentH + "px";
                    $("#TB_ajaxContent")[0].scrollTop = 0;
                    $("#TB_ajaxWindowTitle").html(e)
                }
            }
            $("#TB_closeAjaxWindow").click(tb_remove);
            if (t.indexOf("TB_inline") !== -1) {
                $("#TB_ajaxContent").append($("#" + f["inlineId"]).children().clone());
                $("#TB_load").remove();
                $("#TB_window").addClass("show");
            } else if (t.indexOf("TB_iframe") !== -1) {
                $("#TB_load").remove();
                $("#TB_window").addClass("show");
            } else {
                $("#TB_ajaxContent").load(t += "&random=" + (new Date).getTime(), function () {
                    $("#TB_load").remove();
                    tb_init("#TB_ajaxContent a.thickbox");
                    $("#TB_window").addClass("show");
                });
            }
            //roundCssTransformMatrix($("#TB_window"));
        }
        if (!f["modal"]) {
            document.onkeyup = function (e) {
                if (e === null) {
                    keycode = event.keyCode;
                } else {
                    keycode = e.which;
                }
                if (keycode === 27) {
                    tb_remove();
                }
            }
        }
    } catch (l) {
        alert(l.description)
    }
}

function tb_showIframe() {
    $("#TB_load").remove();
    $("#TB_window").addClass("show");
}

function tb_remove() {
    $("body").removeClass("tb-open");
    $("#TB_imageOff").unbind("click");
    $("#TB_window").removeClass("show").fadeOut("fast", function() {
        $("#TB_window,#TB_overlay,#TB_HideSelect").unbind().remove()
    });
    $("#TB_load").remove();
    if (typeof document.body.style.maxHeight === "undefined") {
        $("body", "html").css({
            height: "auto",
            width: "auto"
        });
        $("html").css("overflow", "");
    }
    document.onkeydown = "";
    document.onkeyup = "";
    return false
}

function tb_parseQuery(e) {
    var t = {};
    if (!e) {
        return t
    }
    var n = e.split(/[;&]/);
    for (var r = 0; r < n.length; r++) {
        var i = n[r].split("=");
        if (!i || i.length !== 2) {
            continue
        }
        var s = unescape(i[0]);
        var o = unescape(i[1]);
        o = o.replace(/\+/g, " ");
        t[s] = o
    }
    return t
}

function tb_getPageSize() {
    var e = document.documentElement;
    var t = window.innerWidth || self.innerWidth || e && e.clientWidth || document.body.clientWidth;
    var n = window.innerHeight || self.innerHeight || e && e.clientHeight || document.body.clientHeight;
    arrayPageSize = [t, n];
    return arrayPageSize
}

function tb_detectMacXFF() {
    var e = navigator.userAgent.toLowerCase();
    if (e.indexOf("mac") !== -1 && e.indexOf("firefox") !== -1) {
        return true;
    }
}

function roundCssTransformMatrix(el){
    el.style.transform = ""; //resets the redifined matrix to allow recalculation, the original style should be defined in the class not inline.
    var mx = window.getComputedStyle(el, null); //gets the current computed style
    mx = mx.getPropertyValue("-webkit-transform") ||
    mx.getPropertyValue("-moz-transform") ||
    mx.getPropertyValue("-ms-transform") ||
    mx.getPropertyValue("-o-transform") ||
    mx.getPropertyValue("transform") || false;
    var values = mx.replace(/ |\(|\)|matrix/g,"").split(",");
    for(var v in values) {  values[v]=Math.ceil(values[v]);  }
    el.style.transform = "matrix("+values.join()+")";
}

$(function() {
    tb_init("a.thickbox, area.thickbox, input.thickbox");
    imgLoader = new Image;
    imgLoader.src = "../../Imagens/loadingAnimation.gif";
    $("#content > div").hide();
    $("#content > div:eq(0)").show();
    $("#tabs > a").addClass("link");
    $("#tabs > a:eq(0)").addClass("link-main")
})