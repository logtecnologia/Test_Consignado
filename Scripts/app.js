/*
Inicio searchkeyup
 */
var searchkeyup = {
    init: function () {

        $("[data-search-keyup]").keyup(function (e) {
            e.preventDefault();
            var data_search_id = $(this).attr('id');

            var data_search_keyup_min = $(this).attr('data-search-keyup-min');
            var data_search_keyup_group = $(this).attr('data-search-keyup-group');
            var data_search_keyup_sistema = $(this).attr('data-search-keyup-sistema');
            var data_search_keyup_tabela = $(this).attr('data-search-keyup-tabela');
            var data_search_keyup_consultaComposta = $(this).attr('data-search-keyup-consultaComposta');
            var data_search_keyup_consultaComposta2 = $(this).attr('data-search-keyup-consultaComposta2');
            var data_search_keyup_consultaDinamica = $(this).attr('data-search-keyup-consultaDinamica');
            var data_search_keyup_consultaDinamica2 = $(this).attr('data-search-keyup-consultaDinamica2');
            var data_search_callback = $(this).attr('data-search-callback');

            if (data_search_keyup_consultaDinamica != null && data_search_keyup_consultaDinamica != "") {
                data_search_keyup_consultaDinamica.split(",").forEach(function (item) {
                    var resultado = $("#" + item).val()
                    if (typeof resultado === "undefined") {
                        data_search_keyup_consultaComposta = data_search_keyup_consultaComposta + ","
                    } else {
                        data_search_keyup_consultaComposta = data_search_keyup_consultaComposta + "," + resultado;
                    }
                })
            }
            if (data_search_keyup_consultaDinamica2 != null && data_search_keyup_consultaDinamica2 != "") {
                data_search_keyup_consultaDinamica2.split(",").forEach(function (item) {
                    var resultado2 = $("#" + item).val()
                    if (typeof resultado2 === "undefined") {
                        data_search_keyup_consultaComposta2 = data_search_keyup_consultaComposta2 + ","
                    } else {
                        data_search_keyup_consultaComposta2 = data_search_keyup_consultaComposta2 + "," + resultado2;
                    }
                })
            }

            var query = $(this).val().toLowerCase();

            if (!data_search_keyup_min) {
                data_search_keyup_min = 0;
            }

            if (query && query.length >= data_search_keyup_min) {
                // loop through all elements to find match

                $.ajax({
                    type: "POST",
                    url: "/arearestrita/auxEstruturaTabelas.cshtml",
                    dataType: "json",
                    data: {
                        Acao: 'C',
                        NomeSistema: data_search_keyup_sistema,
                        NomeTabela: data_search_keyup_tabela,
                        Descricao: query,
                        ConsultaComposta: data_search_keyup_consultaComposta,
                        ConsultaComposta2: data_search_keyup_consultaComposta2
                    },

                    success: function (data) {
                        if (data.length == 1) {
                            document.querySelectorAll('[data-search-keyup-group=' + data_search_keyup_group + ']').forEach((item, index) => {
                                if (item.id != data_search_id) {
                                    if (item instanceof HTMLInputElement)
                                        item.value = data[0][item.getAttribute("data-search-keyup-column")];
                                    if (item instanceof HTMLSpanElement)
                                        item.innerHTML = data[0][item.getAttribute("data-search-keyup-column")];
                                }
                            });
                        } else {
                            document.querySelectorAll('[data-search-keyup-group=' + data_search_keyup_group + ']').forEach((item, index) => {
                                if (item.id != data_search_id) {
                                    if (item instanceof HTMLInputElement)
                                        item.value = '';
                                    if (item instanceof HTMLSpanElement)
                                        item.innerHTML = '';
                                }
                            });
                        }

                        new Function(data_search_callback)();
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(xhr);
                        console.log(ajaxOptions);
                        console.log(thrownError);
                    }
                });

            } else {
                // empty query so show everything
                document.querySelectorAll('[data-search-keyup-group=' + data_search_keyup_group + ']').forEach((item) => {
                    if (item.id != data_search_id) {
                        if (item instanceof HTMLInputElement)
                            item.value = '';
                        if (item instanceof HTMLSpanElement)
                            item.innerHTML = '';
                    }
                });
            }
        });
    }
}

/* Fim searchkeyup */

/* Inicio Search */

function searchPopover(obj) {
    var source = $(obj).closest(".popover-body");
    var descricao = $(source).find('input[name="descricao"]').val();
    var qualquerParte = $(source).find('input[name="qualquerParte"]').is(':checked');
    var consultaComposta = $(source).children().attr('data-consulta-composta');
    var consultaComposta2 = $(source).children().attr('data-consulta-composta2');
    var consultaDinamica = $(source).children().attr('data-consulta-dinamica');
    var consultaDinamica2 = $(source).children().attr('data-consulta-dinamica2');
    if (consultaDinamica != null && consultaDinamica != "") {
        consultaDinamica.split(",").forEach(function (item) {
            var resultado = $("#" + item).val()
            if (typeof resultado === "undefined") {
                consultaComposta = consultaComposta + ","
            } else {
                consultaComposta = consultaComposta + "," + resultado;
            }
        })
    }
    if (consultaDinamica2 != null && consultaDinamica2 != "") {
        consultaDinamica2.split(",").forEach(function (item) {
            var resultado2 = $("#" + item).val()
            if (typeof resultado2 === "undefined") {
                consultaComposta2 = consultaComposta2 + ","
            } else {
                consultaComposta2 = consultaComposta2 + "," + resultado2;
            }
        })
    }

    var nomeSistema = $(source).children().attr('data-nome-sistema');
    var nomeTabela = $(source).children().attr('data-nome-tabela');

    var resultadoTresPontos = $(source).find('#resultadoTresPontos');
    resultadoTresPontos.html("")

    if (descricao == "") {
        resultadoTresPontos.prepend('<div class="alert alert-danger" role="alert">Informe + Nome + para a consulta.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>');
        return;
    }

    if (qualquerParte)
        descricao = '%' + descricao;

    $.ajax({
        type: "POST",
        url: "/arearestrita/auxEstruturaTabelas.cshtml",
        dataType: "json",
        data: { Acao: 'C', NomeSistema: nomeSistema, NomeTabela: nomeTabela, Descricao: descricao, ConsultaComposta: consultaComposta, ConsultaComposta2: consultaComposta2 },

        success: function (data) {
            var erro = "";

            if (data.DeuErro == "S")
                erro = data.MsgErro;

            if (data == "")
                erro = "Nenhum registro encontrado";

            if (erro == "") {
                resultadoTresPontos.html(populateTable(data));
                $(resultadoTresPontos).parent().parent().addClass("popover-overflow");
            } else {
                resultadoTresPontos.prepend('<div class="alert alert-danger" role="alert">' + erro + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });
}

function FecharJanela(obj) {
    var source = $(obj).closest(".popover-body");
    var group = $(source).children().attr('data-search-group');
    var data_callback = $(source).children().attr('data-callback');

    document.querySelectorAll('[data-search-group=' + group + ']').forEach((item) => {
        if (item instanceof HTMLInputElement)
            item.value = $(obj).find("[data-map-column=" + item.getAttribute("data-search-column") + "]").text();
        if (item instanceof HTMLSpanElement)
            item.innerHTML = $(obj).find("[data-map-column=" + item.getAttribute("data-search-column") + "]").text();
    });
    new Function(data_callback)();

    $(obj).closest(".popover").popover('hide');
}

function populateTable(data) {
    var thead = populateTableHeader(data);
    var tbody = populateTableBody(data);

    return thead + tbody;
}

function populateTableBody(data) {
    var columns = Object.keys(data[0]);

    let results = data.map((r, index) => {
        let row = "<tr onclick='FecharJanela(this)'>";
        columns.forEach(function (key) {
            row += "<td data-map-column=" + key + ">" + r[key] + "</td>";
        });
        row += "</tr>";
        return row;
    });
    return "<tbody>" + results.join('') + "</tbody>";
}

function populateTableHeader(data) {
    var columns = Object.keys(data[0]);
    var headerCells = columns.map(r => {
        return "<th>" + r + "</th>";
    });

    return "<thead><tr>" + headerCells.join('') + "</thead></tr>";

}

/* Fim Search */

/**
Objetivo: Impede a digitacão de caracteres inv�lidos
Sintaxe: onkeypress="ValidaCaracterRENACH();"
*/
function ValidaCaracterRENACH() {
    var palavra = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
    var key = event.keyCode || event.which;
    var tecla = String.fromCharCode(key);
    if (palavra.indexOf(tecla) < 0) {
        event.preventDefault();
    }
}

/**
Objetivo: Mostrar os status de carregando do sistema
Sintaxe: wait(formulario);
*/
function wait() {
    document.form1.querySelector("#starttime").value = new Date().getTime();

    let myloadSpinner = new loadSpinner();
    document.form1.querySelector("#loadtime").append(myloadSpinner);

    if (document.form1.querySelector("#botoes") != null) {
        var myloadBar = new loadBar();
        document.form1.querySelector("#botoes").append(myloadBar);
    }
}

/*
StrZero: Alinha um numero com zeros a esquerda
Sintaxe: StrZero(valor, digitos);
Autor: Sérgio Fé
Data: 13/12/2004
*/
function PreencheComZero(id, Posicoes) {
    var obj = document.getElementById(id);
    var strTexto = obj.value;
    var i;
    var strAux = '';

    if (obj.value != "") {
        for (i = strTexto.length; i < Posicoes; i++) {
            strAux += '0';
        }
    }

    obj.value = strAux + strTexto;
}

/**
 * Objetivo: Codifica String para resolver problema de CHARSET
 * Sintaxe: codificaString(valor);
*/
function HTMLEncode(string) {
    var arguments = string.split();

    var strRetorno = "";
    for (var i = 0; i < arguments[0].length; i++) {
        if (arguments[0].charCodeAt(i) < 128) {
            strRetorno += arguments[0].charAt(i);
        }
        else {
            strRetorno += "&#" + arguments[0].charCodeAt(i) + ";";
        }
    }

    return strRetorno;
}

/**
 * Objetivo: Arredonda um valor float de acordo com as casas decimais desejada
 * Sintaxe: arredonda(valor, casas);
*/
function arredonda(valor, casas) {
    var novo = Math.round(valor * Math.pow(10, casas)) / Math.pow(10, casas);
    return (novo);
}

function carregaPlaca(ObjetoPlaca) {
    var a = ObjetoPlaca.value;
    parent.document.getElementById('ConsultaVeiculo').value = ObjetoPlaca.value;
}

/**
 * Objetivo: StrZero: Alinha um numero com zeros a esquerda
 * Sintaxe: StrZero(valor, digitos);
 * Autor: Sérgio Fé
 * Data:13/12/2004
 */
function StrZero(strTexto, intZeros) {
    var i;
    var strAux = '';
    for (i = strTexto.length; i < intZeros; i++) {
        strAux += '0';
    }
    strAux += strTexto;
    return (strAux);
}

/**
Objetivo: Esconde um objeto da pagina
Sintaxe: hide('objetos')
*/
function hide(nodes) {
    if (nodes != null) {
        if (nodes == '[object NodeList]') {
            nodes.forEach((item) => item.style.display = "none");
        } else {
            nodes.style.display = "none";
        }
    }
}

/**
Objetivo: Exibe um objeto da pagina
Sintaxe: show('objetos')
*/
function show(nodes) {
    if (nodes != null) {
        if (nodes == '[object NodeList]') {
            nodes.forEach((item) => item.style.display = "");
        } else {
            nodes.style.display = "";
        }
    }
}

function toggle(elem) {
    if (elem != null) {
        // If the element is visible, hide it
        if (window.getComputedStyle(elem).display === 'block') {
            hide(elem);
        } else {
            // Otherwise, show it
            show(elem);
        }
    }
};

/**
Objetivo: Consultar o idPessoa e o Nome do operador quando digita o CPF
Autor: Anderson Luis
Data: 07/12/2006
Sintaxe: onKeyUp="ConsultaOperador(this, <objeto que vai receber o idPessoa>, <objeto que vai receber o nome da pessoa>);
Observa��o: O uso dessa fun��o requer a adi��o do iframe logo ap�s o <body>: <iframe src="../../frameOperador.cshtml" name="myIframeOperador" id="myIframeOperador" style="display:none;"></iframe>
MANUTENÇÕES (Data - Desenvolvedor - Atualiza��o - Solicitante - Bookmark):
08/06/2015 - No�lio Dutra - Inserir em funcoes.js para a tela Detrannet/Cadastro/operadorciretran.cshtml
*/
function ConsultaOperador(input, idPessoa, Nome) {
    if (input.value.length != 11 && input.value.length != 14) {
        document.getElementById(idPessoa).value = '';
        if (Nome != '') {
            document.getElementById(Nome).value = '';
        }
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../../frameOperador.cshtml', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        xhr.onload = function () {
            if (xhr.status === 200) {
                if (xhr.length == 1) {
                    document.getElementById(idPessoa).value = xhr[0].idPessoa;
                    document.getElementById(Nome).value = xhr[0].Nome;
                } else {
                    document.getElementById(Nome).value = 'ERRO: documento duplicado';
                }
            }
            else if (xhr.status !== 200) {
                if (xhr.responseText.indexOf('/login.cshtml') > 0) {
                    window.location.replace('/controleacesso/expirou.cshtml')
                    return;
                } else {
                    document.getElementById(Nome).value = xhr.responseText;
                }
            }
        };
    }
}

function toggleClass(el, classToToggle) {
    if (el != null) {
        el.classList.toggle(classToToggle)
    }
}

/**
 * Objetivo: Exibe/Esconde um objeto da pagina
 * Sintaxe: display('id do objeto')
*/
function displayCabecalho(id) {
    if ($('#seta-aba-' + id).hasClass("aberta")) {
        $('#seta-aba-' + id).removeClass("aberta").addClass("fechada");
        $('#' + id).hide();
    } else {
        $('#seta-aba-' + id).removeClass("fechada").addClass("aberta");
        $('#' + id).show();
    }
}

function warn(msg) {
    console.warn(msg);

    let warn = document.createElement("div");
    warn.style = "position:absolute; left:0; top:0; width: 100%; height:5px; background-color:#f08214; display:block;";
    document.form1.appendChild(warn);

    sleep(100);
}

function ExecutaAcao(acao, mensagem) {
    warn("Essa função está descontinuada, alterar para executarAcao(acao, mensagem)");

    setTimeout(function () {
        executaAcao(acao, mensagem);
    }, 200);
}

/**
Objetivo: executa o click dos botões da tela botoes.cshtml
Sintaxe: onClick="executaAcao('C', 'Deseja realmente excluir?');"
*/
function executaAcao(acao, mensagem) {
    loading();

    if (document.form1.Acao != undefined) {
        warn("substitua o input Acao por acao");

        document.form1.Acao.value = acao;
    }

    if (document.form1.acao != undefined) {
        document.form1.acao.value = acao;
    }

    $("input[type=button]:not('#Limpar'), button:not('#Limpar')").prop("disabled", true);

    if (mensagem != "" && mensagem != null && mensagem != undefined) {
        if (window.confirm(mensagem)) {
            document.form1.submit();
        }
    } else {
        document.form1.submit();
    }
}

function loading() {
    let spinner = new loadSpinner();
    let bar = new loadBar();
    let node = document.body.firstChild;

    bar.style = "position:fixed; top:0; left:0; width: 100%; display:block;";
    spinner.style = "position:fixed; top:15px; left:50%; display:block;";

    node.parentNode.insertBefore(bar, node);
    node.parentNode.insertBefore(spinner, node);

    //if (document.form1.querySelector(".header-body") != undefined) {
    //    node = document.form1.querySelector(".header-body");
    //    node.parentNode.insertBefore(spinner, node.nextSibling);
    //}
    //else {
    //    node = document.body.firstChild;
    //    node.parentNode.insertBefore(spinner, node);
    //}
};

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function clearForm() {
    var els = document.form1.querySelectorAll("input, select");
    if (els != null) {
        els.forEach(function (item) {
            var type = item.type;
            var tag = item.tagName.toLowerCase();

            if (item.id != "starttime") {
                if (type == 'text' || type == 'hidden' || type == 'password' || tag == 'textarea' || tag == 'date') {
                    item.value = "";
                } else if (type == 'checkbox' || type == 'radio') {
                    item.checked = false;
                } else if (tag == 'select') {
                    item.selectedIndex = -1;
                }
            }
        });
    }
};

/**
Objetivo: Abre o extrato de pessoa
Sintaxe: onClick="ExtratoPessoa('<%=rs("CPF")%>')"
*/
function ExtratoPessoa(valor) {
    parent.document.getElementById('InputConsultaExtrato').value = valor;
    var obj = parent.document.getElementById('BotaoConsultaExtrato');
    $(obj).trigger("click");
}

/**
Objetivo: Abre o extrato de Ve�culo
Sintaxe: onClick="ExtratoVeiculo('<%=rs("Placa")%>')"
*/
function ExtratoVeiculo(valor) {
    parent.document.getElementById('InputConsultaExtrato').value = valor;
    var obj = parent.document.getElementById('BotaoConsultaExtrato');
    $(obj).trigger("click");
}

/**
Objetivo: executa o click do Botao "LIMPAR" da pagina de botoes
Sintaxe: onClick="EstadoInicial()"
*/
function EstadoInicial() {
    warn("Substitua EstadoInicial por estadoInicial");
    estadoInicial();
}

/**
Objetivo: executa o click do Botao "LIMPAR" da pagina de botoes
Sintaxe: onClick="estadoInicial()"
*/
function estadoInicial() {
    loading();
    clearForm();
    window.location = window.location.pathname;
}

/**
Objetivo: executa o click do Botao "ExportarExcel" da pagina de botoes
Sintaxe: onClick="exportarExcel('NomedaDiv')"
*/
function exportarExcel(idDiv) {
    var a = document.createElement('a');
    var data_type = 'data:application/vnd.ms-excel';
    var table_div = document.getElementById(idDiv);
    a.href = window.URL.createObjectURL(new Blob(['\ufeff' + table_div.outerHTML], {
        type: data_type
    }));
    a.download = 'Tabela.xls';
    a.click();
    preventDefault();
}

/**
Objetivo: Retorna TRUE/FALSE se for NULO
Sintaxe: isNull('')
*/
function isNull(a) {
    return typeof a == 'object' && !a;
}

/**
Objetivo: Retorna TRUE/FALSE se for OBJETO
Sintaxe: isObject('')
*/
function isObject(a) {
    return (typeof a === "object") && (a != null);
}

/**
Objetivo: Retorna o largura da pagina
Sintaxe: getWidth()												
*/
function getWidth() {
    return window.innerWidth && window.innerWidth > 0 ? window.innerWidth : /* Non IE */
        document.documentElement.clientWidth && document.documentElement.clientWidth > 0 ? document.documentElement.clientWidth : /* IE 6+ */
            document.body.clientWidth && document.body.clientWidth > 0 ? document.body.clientWidth : -1; /* IE 4 */
}

/**
Objetivo: Retorna a altura da pagina
Sintaxe: getHeight()												
*/
function getHeight() {
    return window.innerHeight && window.innerHeight > 0 ? window.innerHeight : /* Non IE */
        document.documentElement.clientHeight && document.documentElement.clientHeight > 0 ? document.documentElement.clientHeight : /* IE 6+ */
            document.body.clientHeight && document.body.clientHeight > 0 ? document.body.clientHeight : -1; /* IE 4 */
}

function sanitizeHTML(str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

/**
Objetivo: Abre um popup na pagina com um titulo e um iframe para a URL
Sintaxe: windowOpen('titulo', 'url')
*/
function windowOpen(titulo, url) {
    if (url.indexOf("?") == -1 || url.indexOf("ReportServer") != -1)
        url += "?TB_iframe=true&keepThis=true";
    else
        url += "&TB_iframe=true&keepThis=true";

    tb_show(titulo, url, '');
}

function windowOpenInline(titulo, id) {
    var url = "#TB_inline?inlineId=" + id;
    tb_show(titulo, url, '');
}

/**
Objetivo: Efetua a valida��o do campo numerico e com exce��o do enter
Sintaxe:  onKeyPress="isnumericenter()"
*/
function isnumericenter() {
    var key = event.keyCode || event.which;
    if ((key < 48 || key > 57) && key != 13) {
        event.preventDefault();
    }
}

/**
Objetivo: Efetua a valida��o do campo numerico
Sintaxe:  onKeyPress="isnumeric()"
*/
function isnumeric() {
    var key = event.keyCode || event.which;
    if (key < 48 || key > 57) {
        event.preventDefault();
    }
}

/**
Objetivo: Efetua a valida��o do campo
Sintaxe:  onKeyPress="ValidaCaracter()"
*/
function ValidaCaracter() {
    var palavra = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ,<.>;:/?-_=+@";
    var key = event.keyCode || event.which;
    var tecla = String.fromCharCode(key);
    if (palavra.indexOf(tecla) < 0) {
        event.preventDefault();
    }
}

/**
Objetivo: Transformar os valores do campo em letras maiusculas
Sintaxe:  onKeyPress="maiusculo()"
*/
function maiusculo() {
    var key = event.keyCode || event.charCode
    var tecla = String.fromCharCode(key);
    tecla = tecla.toUpperCase();
    event.charCode = tecla.charCodeAt();
    event.returnCode = true;
}

/**
Objetivo: Apresenta um calend�rio nos campos que for do tipo Data
Sintaxe:  class='date'
*/
function formatDate() {
    $(".date").datepicker({
        showOn: "button",
        buttonImage: "~Imagens/calendario.png",
        buttonImageOnly: true,

        closeText: 'Fechar',
        prevText: '&#x3c;Anterior',
        nextText: 'Pr&oacute;ximo&#x3e;',
        currentText: 'Hoje',
        monthNames: ['Janeiro', 'Fevereiro', 'Mar&ccedil;o', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        dayNames: ['Domingo', 'Segunda-feira', 'Ter&ccedil;a-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'S&aacute;bado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'S&aacute;b'],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: '',
        showButtonPanel: false,
        numberOfMonths: 1
    });

    if ($(".date").length > 0) {
        $(".date").mask('00/00/0000');
    }
}

/**
Recebe um data no formato dd/mm/yyyy e retorna yyyy-mm-dd.
*/
function FormataDataAnoMesDia(date) {
    if (date != null || date != undefined) {
        return date.split('/').reverse().join('-');
    } else {
        return null;
    }
}

/**
Recebe um data no formato yyyy-mm-dd e retorna dd/mm/yyyy.
*/
function FormataDataDiaMesAno(date) {
    if (date != null || date != undefined) {
        return date.split('-').reverse().join('/');
    } else {
        return null;
    }
}

/**
Objetivo: Limitar a quantidade de caracteres em um campo textarea
Sintaxe:  maxlength="100"
*/
function setMaxLength() {
    var x = document.getElementsByTagName('textarea');
    var counter = document.createElement('div');
    counter.className = 'counter';
    for (var i = 0; i < x.length; i++) {
        if (x[i].getAttribute('maxlength')) {
            var counterClone = counter.cloneNode(true);
            counterClone.relatedElement = x[i];
            counterClone.innerHTML = '<span>' + x[i].getAttribute('maxlength') + '</span> Caracter(es) restante(s)';
            x[i].parentNode.insertBefore(counterClone, x[i].nextSibling);
            x[i].relatedElement = counterClone.getElementsByTagName('span')[0];
            x[i].onkeydown = x[i].onchange = checkMaxLength;
            x[i].onkeydown();
            x[i].onkeyup = x[i].onchange = checkMaxLength;
            x[i].onkeyup();
        }
    }
}

function checkMaxLength() {
    var maxLength = this.getAttribute('maxlength');
    var currentLength = this.value.length;
    if (currentLength > maxLength) {
        //this.relatedElement.className = 'toomuch';
        this.value = this.value.substring(0, maxLength);
        this.relatedElement.firstChild.nodeValue = 0;
        alert('Quantidade M�xima de caracteres atingida.');
    }
    else {
        this.relatedElement.className = '';
        this.relatedElement.firstChild.nodeValue = maxLength - currentLength;
    }
}

/**
Efetua a consulta do CEP
Sintaxe:  onKeyUp="consultacep(this);" onBlur="consultacep(this);"
*/
function consultacep(obj, idCEP, TipoLogradouro, Logradouro, Numero, Complemento, Bairro, CodLocalEndereco, NomeLocalEndereco, UFLocalEndereco) {

    if ($("#spanCEP").length == 0) {
        $('#' + obj.id).parent().append("<span id='spanCEP'></span>");
    }

    if (obj.value.length != 8) {
        $('#' + idCEP).val('');
        $('#' + TipoLogradouro).val('');
        $('#' + Logradouro).val('');
        $('#' + Numero).val('');
        $('#' + Complemento).val('');
        $('#' + Bairro).val('');
        $('#' + CodLocalEndereco).val('');
        $('#' + NomeLocalEndereco).val('');
        $('#' + UFLocalEndereco).val('');
        $('#' + UFLocalEndereco).val('');
        $('#spanCEP').html('');
        $('#spanCEP').removeClass('msgErro');
        return;
    } else {
        $.ajax({
            type: "POST",
            url: "../../frameCEP.cshtml",
            dataType: "json",
            data: { oculto: 'C', CEP: obj.value, TipoRetorno: 'JSON' },

            beforeSend: function () {
                $('#' + idCEP).val('');
                $('#' + TipoLogradouro).val('');
                $('#' + Logradouro).val('');
                $('#' + Numero).val('');
                $('#' + Complemento).val('');
                $('#' + Bairro).val('');
                $('#' + CodLocalEndereco).val('');
                $('#' + NomeLocalEndereco).val('');
                $('#' + UFLocalEndereco).val('');
                $('#spanCEP').html('');
                $('#spanCEP').removeClass('msgErro');
            },

            success: function (data) {
                if (data.length == 1) {
                    $('#' + idCEP).val(data[0].idCEP);
                    $('#' + TipoLogradouro).val(data[0].TipoLogradouro);
                    $('#' + Logradouro).val(data[0].Logradouro);
                    $('#' + Complemento).val(data[0].Complemento);
                    $('#' + Bairro).val(data[0].Bairro);
                    $('#' + CodLocalEndereco).val(data[0].CodLocal);
                    $('#' + NomeLocalEndereco).val(data[0].NomeLocal);
                    $('#' + UFLocalEndereco).val(data[0].UF);
                    $('#' + Numero).focus();
                }

                if (data.length > 1) {
                    $('#spanCEP').html('Foram encontrados ' + data.length + ' logradouros para este CEP.');
                    $('#spanCEP').addClass('msgErro');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('#spanCEP').html(xhr.responseText);
                $('#spanCEP').addClass('msgErro');
            }
        });
    }
}

/**
Efetua a consulta do municipio pelo local
Sintaxe:  onKeyUp="consultacidade(this, 'NomeLocalEndereco', 'UFLocalEndereco')"
*/
function consultacidade({ obj, NomeLocal, UFLocal, Tamanho }) {

    if ($("#spanCidade").length == 0) {
        $('#' + obj.id).parent().append("<span id='spanCidade' class='msgErro'></span>");
    }
    debugger;
    if (Tamanho < 4) {
        $('#' + NomeLocal).val('');
        $('#spanCidade').html('');
        $('#spanCidade').hide();
        return;
    } else {
        if (Tamanho >= 4) {

            $.ajax({
                type: "POST",
                url: "../../framecidade.cshtml",
                dataType: "json",
                data: { oculto: 'C', CodLocal: obj.value, TipoRetorno: 'JSON' },

                beforeSend: function () {
                    $('#' + NomeLocal).val('');
                    $('#' + UFLocal).val('');
                    $('#spanCidade').html('');
                    $('#spanCidade').hide();
                },

                success: function (data) {
                    if (data.length == 0) {
                        $('#' + NomeLocal).val('');
                        $('#' + UFLocal).val('');
                        $('#spanCidade').html('Cidade/Pais nao localizado');
                        $('#spanCidade').show();
                    }

                    if (data.length == 1) {
                        $('#' + NomeLocal).val(data[0].Cidade);
                        $('#' + UFLocal).val(data[0].UF);
                        $('#spanCidade').hide();
                    }

                    if (data.length > 1) {
                        $('#' + NomeLocal).val('');
                        $('#' + UFLocal).val('');
                        $('#spanCidade').html('Foram encontradas ' + data.length + ' cidades para este Codigo.');
                        $('#spanCidade').show();
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $('#spanCidade').html(xhr.responseText);
                    $('#spanCidade').show();
                }
            });
        }
    }
}

/**
Efetua a consulta do orgao responsavel
Sintaxe:  onKeyUp="ConsultaOrgaoResponsavel(this, 'NomeOrgaoResponsavel')"
*/
function ConsultaOrgaoResponsavel(obj, NomeOrgaoResponsavel) {
    if ($("#spanOrgaoResponsavel").length == 0) {
        $('#' + obj.id).parent().append("<span id='spanOrgaoResponsavel' class='msgErro'></span>");
    }

    if (obj.value.length < 2) {
        $('#' + NomeOrgaoResponsavel).val('');
        $('#spanOrgaoResponsavel').html('');
        $('#spanOrgaoResponsavel').hide();
        return;
    } else {
        if (obj.value.length == 2) {
            $.ajax({
                type: "POST",
                url: "../../frameOrgaoResponsavel.cshtml",
                dataType: "json",
                data: { oculto: 'C', Chave: obj.value, TipoRetorno: 'JSON' },

                beforeSend: function () {
                    $('#' + NomeOrgaoResponsavel).val('');
                    $('#spanOrgaoResponsavel').html('');
                    $('#spanOrgaoResponsavel').hide();
                },

                success: function (data) {
                    if (data.length == 0) {
                        $('#' + NomeOrgaoResponsavel).val('');
                        $('#spanOrgaoResponsavel').html('Orgao Responsavel nao localizado');
                        $('#spanOrgaoResponsavel').show();
                    }

                    if (data.length == 1) {
                        $('#' + NomeOrgaoResponsavel).val(data[0].NomeOrgaoResponsavel);
                        $('#spanOrgaoResponsavel').hide();
                    }

                    if (data.length > 1) {
                        $('#' + NomeOrgaoResponsavel).val('');
                        $('#spanOrgaoResponsavel').html('Foram encontradas ' + data.length + ' Orgaos Responsaveis para este Codigo.');
                        $('#spanOrgaoResponsavel').show();
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $('#spanOrgaoResponsavel').html(xhr.responseText);
                    $('#spanOrgaoResponsavel').show();
                }
            });
        }
    }
}

/**
Consulta os dados do CPF
Sintaxe: onBlur="ConsultaDuplicidadeAjax('url', this,'OBJETO HIDDEN QUE GUARDAR�? IDPESSOA','OBJETO QUE GAURDAR�? O NOME DA PESSOA');
*/
function ConsultaDuplicidadeAjax(url, ObjetoDocPrincipal, ObjetoIdPessoa, ObjetoNome) {
    if (ObjetoDocPrincipal.value.length != 11 && ObjetoDocPrincipal.value.length != 14) {
        $('#' + ObjetoIdPessoa).val('');
        $('#' + ObjetoNome).val('');
        return;
    } else {
        $.ajax({
            type: "POST",
            url: "../../" + url + ".cshtml",
            dataType: "json",
            data: { oculto: 'C', DocumentoPrincipal: ObjetoDocPrincipal.value },
            beforeSend: function () {
                $('#' + ObjetoIdPessoa).val('');
                $('#' + ObjetoNome).val('');
            },
            success: function (data) {
                if (data.length == 0) {
                    $('#' + ObjetoIdPessoa).val('');
                    $('#' + ObjetoNome).val('CPF NAO FOI ENCONTRADO NA BASE LOCAL');
                }
                if (data.length == 1) {
                    $('#' + ObjetoIdPessoa).val(data[0].idPessoa);
                    $('#' + ObjetoNome).val(data[0].Nome);
                }
            }
        });
    }
}

function ConsultaEstruturaTabelaRENACHJSON(NomeTabela, Descricao, ConsultaComposta, ConsultaComposta2) {
    $.ajax({
        type: "POST",
        url: "../../frameEstruturaTabelaRENACHJSON.cshtml",
        dataType: "json",
        data: { NomeTabela: NomeTabela, Descricao: Descricao, ConsultaComposta: ConsultaComposta, ConsultaComposta2: ConsultaComposta2 },

        beforeSend: function () {
            $('#' + ObjetoIdPessoa).val('');
            $('#' + ObjetoNome).val('');
        },
        success: function (data) {
            if (data.length == 0) {
                $('#' + ObjetoIdPessoa).val('');
                $('#' + ObjetoNome).val('CPF NAO FOI ENCONTRADO NA BASE LOCAL');
            }
            if (data.length == 1) {
                $('#' + ObjetoIdPessoa).val(data[0].idPessoa);
                $('#' + ObjetoNome).val(data[0].Nome);
            }
        }
    });
}

/**
Sintaxe: onBlur="ConsultaEstruturaTabelaRenavam ('frameConsultaTabelaRenavam', 'NomePessoaPorDocumento', 'DocPrincipal', null, null, 'idPessoa', 'NomePessoa');"
@url: Link da p�gina que vai ser chamada via ajax
@NomeTabela: Nome da tabela de pesquisa na procedure
@ObjetoDescricao: Name do input com valor a ser enviado para a procedure, caso n�o tenha use null
@ObjetoConsultaComposta: Name do input com valor a ser enviado para a procedure, caso n�o tenha use null
@ObjetoConsultaComposta2: Name do input com valor a ser enviado para a procedure, caso n�o tenha use null
@NomeCampo1: Input que vai receber o valor retornado pela procedure na coluna id, caso n�o tenha use null
@NomeCampo2: Input que vai receber o valor retornado pela procedure na coluna Descricao, caso n�o tenha use null
*/
function ConsultaEstruturaTabelaRenavam(url, NomeTabela, ObjetoDescricao, ObjetoConsultaComposta, ObjetoConsultaComposta2, NomeCampo1, NomeCampo2) {
    var Descricao = "";
    var ConsultaComposta = "";
    var ConsultaComposta2 = "";

    if (NomeCampo1 != null) {
        document.getElementById(NomeCampo1).value = "";
    }

    if (NomeCampo2 != null) {
        document.getElementById(NomeCampo2).value = "";
    }

    if (ObjetoDescricao != null) {
        Descricao = document.getElementById(ObjetoDescricao).value;
    }

    if (ObjetoConsultaComposta != null) {
        ConsultaComposta = document.getElementById(ConsultaComposta).value;
    }

    if (ObjetoConsultaComposta2 != null) {
        ConsultaComposta2 = document.getElementById(ConsultaComposta2).value;
    }

    if (Descricao == "" && ConsultaComposta == "" && ConsultaComposta2 == "") {
        return
    }

    $.ajax({
        type: "POST",
        url: "../../" + url + ".cshtml",
        dataType: "json",
        async: false,
        data: {
            NomeTabela: NomeTabela,
            Descricao: Descricao,
            ConsultaComposta: ConsultaComposta,
            ConsultaComposta2: ConsultaComposta2
        },
        success: function (data) {
            if (data == null) {
                if (NomeCampo1 != null) {
                    document.getElementById(NomeCampo1).value = "";
                }
                if (NomeCampo2 != null) {
                    document.getElementById(NomeCampo2).value = "";
                }
            } else {
                if (NomeCampo1 != null) {
                    document.getElementById(NomeCampo1).value = data[0].id;
                }
                if (NomeCampo2 != null) {
                    document.getElementById(NomeCampo2).value = data[0].Descricao;
                }
            }
        }
    });
}

function moeda2float(moeda) {
    if (moeda == "") moeda = "0";
    moeda = moeda.replace(".", "");
    moeda = moeda.replace(",", ".");
    return parseFloat(moeda);
}

/**
Formatar tipo float em Moeda
Sintaxe: float2moeda(valor)"
*/
function float2moeda(num) {
    x = 0;
    if (num < 0) {
        num = Math.abs(num);
        x = 1;
    }
    if (isNaN(num)) num = "0";
    {
        cents = Math.floor((num * 100 + 0.5) % 100);
    }
    num = Math.floor((num * 100 + 0.5) / 100).toString();
    if (cents < 10) cents = "0" + cents;
    {
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
            num = num.substring(0, num.length - (4 * i + 3)) + '.' + num.substring(num.length - (4 * i + 3));
        }
    }
    ret = num + ',' + cents;
    if (x == 1)
        ret = ' - ' + ret;
    return ret;
}

function trace(s) {
    if (s == "") return;
    try { console.log(s) } catch (e) { alert(s) }
}

function aplicarFormatos() {
    if ($("input.date").length > 0) {
        $("input.date").mask("99/99/9999");
    }

    if ($(".hora").length > 0) {
        $(".hora").mask('Hh:Mm', {
            'translation': {
                H: { pattern: /[0-2]/ },
                h: { pattern: /[0-9]/ },
                M: { pattern: /[0-5]/ },
                m: { pattern: /[0-9]/ }
            }
        });
    }

    if ($('.money').length > 0) {
        $('.money').mask('000.000.000.000.000,00', { reverse: true });
    }

    if ($('.quatrodecimais').length > 0) {
        $('.quatrodecimais').mask('000.000.000.000.000,0000', { reverse: true });
    }

    if ($('.inteiro').length > 0) {
        $('.inteiro').keypress(function (e) {
            var key = e.keyCode || e.charCode;
            if (key < 48 || key > 57) {
                e.preventDefault()
            }
        }).mask('000.000.000', { reverse: true });
    }

    if ($(".cpf").length > 0) {
        $(".cpf").mask('000.000.000-00');
    }

    if ($(".telefone").length > 0) {
        $(".telefone").mask('(00) 00000-0000');
    }

    if ($(".cnpj").length > 0) {
        $(".cnpj").mask('00.000.000/0000-00');
    }

    if ($(".desabilita-control-v").length > 0) {
        $('.desabilita-control-v').bind("cut copy paste", function (e) {
            e.preventDefault();
        });
    }

    $(".maiusculo").on('keyup', function (e) {
        var key = e.keyCode || e.charCode
        if (key >= 65 && key <= 90) {
            var textBox = e.target;
            var start = textBox.selectionStart;
            var end = textBox.selectionEnd;
            textBox.value = textBox.value.toUpperCase();
            textBox.setSelectionRange(start, end);
        }
    }).on('blur', function (e) {
        var textBox = e.target;
        textBox.value = textBox.value.toUpperCase();
    });

    $(".text-uppercase").on('keyup', function (e) {
        var key = e.keyCode || e.charCode
        if (key >= 65 && key <= 90) {
            var textBox = e.target;
            var start = textBox.selectionStart;
            var end = textBox.selectionEnd;
            textBox.value = textBox.value.toUpperCase();
            textBox.setSelectionRange(start, end);
        }
    }).on('blur', function (e) {
        var textBox = e.target;
        textBox.value = textBox.value.toUpperCase();
    });

    if ($(".numeric").length > 0) {
        $(".numeric").on('keypress', function (e) {
            var key = event.keyCode || event.which;
            if (key < 48 || key > 57) {
                event.preventDefault();
            }
        }).bind("paste", function (e) {
            // quando colar remover todos os caracteres que n�o sejam números
            var idObj = e.target.id;
            setTimeout(function () {
                var Texto = $('#' + idObj).val().replace(/[^0-9]/g, '');
                $('#' + idObj).val(Texto);
            }, 100);
        });
    }

    if ($(".texto").length > 0) {
        $(".texto").bind('paste', function (e) {
            var key = e.keyCode || e.charCode
            if (key > 48 && key < 57) {
                e.preventDefault();
            }
        }).keypress(function (e) {
            var key = e.keyCode || e.charCode
            if (key > 48 && key < 57) {
                e.preventDefault();
            }
        });
    }

    $('.search [data-toggle="popover"]').popover({
        html: true,
        sanitize: false,
        content: function () {
            return $(this).siblings('[aria-labelledby="' + $(this).attr("id") + '"]').html();
        }
    }).on('shown.bs.popover', function (shownEvent) {
        update_popover_data(shownEvent);
    });

    if ($(".modal").length > 0) {
        $("body").append($(".modal"));
    }
}

function update_popover_data(shownEvent) {
    var id = $(shownEvent.target).attr('aria-describedby');

    $('#' + id).find("[aria-labelledby='popoverDescricao']").on("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            $(this).parents().siblings().find('button[name="pesquisar"]').click();
        }
    })
    $('#' + id).find("[aria-labelledby='popoverDescricao']").focus()
    $(document).keyup(function (event) {
        if (event.which === 27) {
            $('#' + id).popover('hide');
        }
    });
}

function HTMLcompressor(html) {
    html = html.replace(/(\r\n|\n|\r|\t)/gm, "");
    html = html.replace(/\s+/g, " ");
    return html;
}

/**
Objetivo: Efetua a valida��o do campo
Sintaxe:  onKeyPress="ValidaCaracter()"
*/
function ValidaCaracter2() {
    var palavra = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz 0123456789&";
    var key = event.keyCode || event.which;
    var tecla = String.fromCharCode(key);
    if (palavra.indexOf(tecla) < 0) {
        event.preventDefault();
    }
}

function FindForm(element) {
    return (element.tagName == "FORM");
}

function getFormularioPeloEvento() {
    return event.path.find(FindForm);
}

/**
 * Objetivo: pegar o formul�rio pai do elemento
 */
function getFormulario() {
    return getFormularioPeloEvento();
}

/**
 * Objetivo: encontar objeto que � aba pai do elemento
 */
function FindDestino(element) {
    return (element.classList.contains("destino"));
}

/**
 * Objetivo: Testar se o elemento est� vis�vel na tela
 */
function isVisible(id) {
    var element = $('#' + id);
    if (element.length > 0 && element.css('visibility') !== 'hidden' && element.css('display') !== 'none') {
        return true;
    } else {
        return false;
    }
}

/**
 * Objetivo: pegar aba pai do elemento
 */
function getObjetoDestino() {
    return event.path.find(FindDestino);
}

function getURL(formulario) {
    var destino = null;

    if (formulario != undefined && formulario != null) {
        destino = formulario.offsetParent;
    }
    else if (event != undefined) {
        destino = getObjetoDestino();
    }

    return $(destino).attr("url");
}

function getDestino(formulario) {
    var destino = null;

    if (formulario != undefined && formulario != null) {
        destino = formulario.offsetParent;
    }
    else if (event != undefined) {
        destino = getObjetoDestino();
    }

    return $(destino).attr("id");
}

function getObjeto() {
    return event.path[0];
}

function AdicionarFiltro(tabela, coluna) {
    var cols = $("#" + tabela + " thead tr:first-child th").length;
    if ($("#" + tabela + " thead tr").length == 1) {
        var linhaFiltro = "<tr class=noprint>";
        for (var i = 0; i < cols; i++) {
            linhaFiltro += "<th></th>";
        }
        linhaFiltro += "</tr>";

        $("#" + tabela + " thead").append(linhaFiltro);
    }
    var colFiltrar = $("#" + tabela + " thead tr:nth-child(2) th:nth-child(" + coluna + ")");

    $(colFiltrar).html("<select id='filtroColuna_" + coluna.toString() + "' class='filtroColuna form-control'> </select>");

    var valores = new Array();

    $("#" + tabela + " tbody tr").each(function () {
        var txt = $(this).children("td:nth-child(" + coluna + ")").text();
        if (jQuery.inArray(txt, valores) < 0) {
            valores.push(txt);
        }
    });
    $("#filtroColuna_" + coluna.toString()).append("<option>TODOS</option>")
    for (elemento in valores) {
        $("#filtroColuna_" + coluna.toString()).append("<option>" + valores[elemento] + "</option>");
    }

    $("#filtroColuna_" + coluna.toString()).change(function () {
        $("#" + tabela + " tbody tr").show();
        $(".filtroColuna").each(function () {
            var filtro = $(this).val();
            var col = $(this).attr("id").replace("filtroColuna_", "");
            if (filtro != "TODOS") {
                $("#" + tabela + " tbody tr").each(function () {
                    var txt = $(this).children("td:nth-child(" + col + ")").text();
                    if (txt != filtro) {
                        $(this).hide();
                    }
                });
            }
        });
        $("#totallinhas").html($("#" + tabela + " tbody tr:visible").length);
    });
};

function tempoExecucao() {
    var time_before = document.form1.querySelector("#starttime").value;

    if (time_before == undefined || time_before == "") {
        time_before = new Date().getTime();
    }

    var time_now = new Date().getTime();
    var execution_time = (((time_now - time_before) / 1000) % 60).toFixed(2);
    document.form1.querySelector("#loadtime").innerHTML = `Aproximadamente ${execution_time} segundos`;
    hide(document.form1.querySelector("#loading"));
}

function setTempoSessao() {
    parent.document.querySelector("#timeout").innerHTML = parent.document.querySelector("#TempoSessao").value + ":00";
}

function fadeOut(el) {
    el.style.opacity = 1;

    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
}

function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";

    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
}

function voltarAoTopo() {
    window.addEventListener('scroll', function () {
        if (this.scrollY > 30) {
            document.querySelectorAll('.voltar-ao-topo').forEach((item) => {
                fadeIn(item)
            });
        } else {
            document.querySelectorAll('.voltar-ao-topo').forEach((item) => {
                fadeOut(item)
            });
        }
    });

    // Faz anima��o para voltar ao topo
    document.querySelectorAll('.voltar-ao-topo').forEach((item) => {
        item.addEventListener("click", function () {
            document.scrollingElement.scrollTop = 0;
        });
    });
}

function loadBar() {
    var elem = document.createElement("div");
    elem.className = "load-bar-box";
    elem.id = `loadBar${new Date().getTime().toString()}`;
    elem.innerHTML = `<div class="load-bar"></div><div class="overlay"></div>`;
    return elem;
}

function loadSpinner() {
    var elem = document.createElement("div");
    elem.className = "load-spinner";
    elem.id = `loadSpinner${new Date().getTime().toString()}`;
    elem.innerHTML = `<div class="spinner-icon"></div>`
    return elem;
}

function innerHTML(elem, str) {
    if (elem != null) {
        elem.innerHTML = str;
    }
}

function moverBotao(idElem, idNode) {
    if ($("#modal_" + idElem).length) {
        idElem = "modal_" + idElem;
    }


    const node = document.getElementById(idNode);
    const elem = document.getElementById(idElem);

    if (node && elem) {
        node.parentNode.insertBefore(elem, node);
        elem.style.marginRight = "0.3em";
        elem.classList.remove("d-none");
    }
}

function abrirAba(url, placa, renavam, chassi) {

    $("#placaextrato").val(placa);
    $("#renavamextrato").val(renavam);
    $("#chassiextrato").val(chassi);

    var tabs = parent.$("#tabs").tabs();
    var idpagina = "";
    var achou = false;

    parent.$(".opentab").each(function (index) {
        if ($(this).attr('data-url').toLowerCase() == url.toLowerCase()) {
            idpagina = $(this).attr("data-idpagina");
            $(this).click();
            achou = true;
        }
    });

    if (idpagina != "") {
        if (tabs.find("#tab-" + idpagina).length > 0) {
            var panelId = tabs.find("#tab-" + idpagina).closest("li").remove().attr("aria-controls");
            parent.$("#" + panelId).remove();
            tabs.tabs("refresh");
            achou = true;
        }
    }

    parent.$(".opentab").each(function (index) {
        if ($(this).attr('data-url').toLowerCase() == url.toLowerCase()) {
            $(this).click();
            achou = true;
        }
    });

    if (!achou) {
        alert('Menu ' + url + ' nao encontrado!');
    }
}

function abrirAbaPessoa(url, cpf) {

    $("#cpf").val(cpf);

    var tabs = parent.$("#tabs").tabs();
    var idpagina = "";
    var achou = false;

    parent.$(".opentab").each(function (index) {
        if ($(this).attr('data-url').toLowerCase() == url.toLowerCase()) {
            idpagina = $(this).attr("data-idpagina");
            $(this).click();
            achou = true;
        }
    });

    if (idpagina != "") {
        if (tabs.find("#tab-" + idpagina).length > 0) {
            var panelId = tabs.find("#tab-" + idpagina).closest("li").remove().attr("aria-controls");
            parent.$("#" + panelId).remove();
            tabs.tabs("refresh");
            achou = true;
        }
    }

    parent.$(".opentab").each(function (index) {
        if ($(this).attr('data-url').toLowerCase() == url.toLowerCase()) {
            $(this).click();
            achou = true;
        }
    });

    if (!achou) {
        alert('Menu ' + url + ' nao encontrado!');
    }
}

/**
 * Objetivo: Mostrar os dados do usuário que executou a etapa do processo
 * onclick="changeUser(this)"
 */
function changeUser(object) {
    var id = object.getAttribute("id");
    var title = object.getAttribute("title");
    var div = $('#span_' + id);

    if (div.length > 0) {
        div.toggle();
    } else {
        $('#span_' + id).remove();
        var newDiv = $('<span id="span_' + id + '" class="text-muted">' + title + '</span>');
        $(object).parent().append(newDiv);
    }
}

function validarRequisitosSenha() {
    const senha = this.value;
    let requisitos = [];

    requisitos.push({
        id: "status-requisito-tamanho-minimo-senha",
        validar: temTamanhoMinimo,
        obrigatorio: true,
        satisfeito: false
    });

    requisitos.push({
        id: "status-requisito-letra-maiuscula",
        validar: temLetraMaiuscula,
        obrigatorio: false,
        satisfeito: false
    });

    requisitos.push({
        id: "status-requisito-letra-minuscula",
        validar: temLetraMinuscula,
        obrigatorio: false,
        satisfeito: false
    });

    requisitos.push({
        id: "status-requisito-numero",
        validar: temNumero,
        obrigatorio: false,
        satisfeito: false
    });

    requisitos.push({
        id: "status-requisito-caracter-especial",
        validar: temCaracterEspecial,
        obrigatorio: false,
        satisfeito: false
    });

    validarRequisitos();
    setStatusRequisitos();
    setProgressBar();

    function validarRequisitos() {
        requisitos.forEach(item => item.satisfeito = item.validar());
    }

    function setStatusRequisitos() {
        requisitos.forEach(item => {
            const elem = document.getElementById(item.id);
            if (elem) {
                if (item.satisfeito) {
                    elem.classList.remove("fe-minus", "text-white");
                    elem.classList.add("fe-check", "text-success");
                } else {
                    elem.classList.remove("fe-check", "text-success");
                    elem.classList.add("fe-minus", "text-white");
                }
            }
        });
    }

    function setProgressBar() {
        const pb = document.getElementById("status-requisito-progress-bar");
        const total = requisitos.length;
        const count = requisitos.filter(x => x.satisfeito).length;
        pb.style.width = parseInt((count / total) * 100).toString() + "%";
    }

    function temTamanhoMinimo() {
        return senha.length >= 8;
    }

    function temLetraMinuscula() {
        return senha.match(/[a-z]/);
    }

    function temLetraMaiuscula() {
        return senha.match(/[A-Z]/);
    }

    function temNumero() {
        return senha.match(/[0-9]/);
    }

    function temCaracterEspecial() {
        return senha.match(/[@!#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/);
    }

    function senhaValida() {
        let todosRequisitosObrigatoriosCumpridos = true;
        let qtdItensOpcionaisCumpridos = 0;

        requisitos.forEach(item => {
            if (item.obrigatorio) {
                if (!item.satisfeito) {
                    todosRequisitosObrigatoriosCumpridos = false;
                }
            } else if (item.satisfeito) {
                qtdItensOpcionaisCumpridos++;
            }
        });

        return (todosRequisitosObrigatoriosCumpridos && qtdItensOpcionaisCumpridos >= 3);
    }
}

/*!
 * Serialize all form data into a query string
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node} form The form to serialize
 * @return {String} The serialized form data
 */
function serialize(elem) {
    // Setup our serialized data
    let serialized = [];

    // test if the element is a form
    if (isForm(elem)) {
        serialized = serializeForm(elem);
    }
    else {
        serialized = serializeObject(elem);
    }

    return serialized.join('&');

    // closure function
    function isForm(elem) {
        return elem.elements != undefined
    }

    function serializeForm(form) {
        let fields = form.elements;
        Array.from(fields).forEach(serializeFields);

        // closure function
        function serializeFields(field) {
            // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
            //if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

            // If a multi-select, get all selections
            if (field.type === 'select-multiple') {
                for (var n = 0; n < field.options; n++) {
                    if (!field.options[n].selected) continue;
                    serialized.push(serializeItem(field.name, field.options[n].value));
                }
            }

            // Convert field data to a query string
            else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                serialized.push(serializeItem(field.name, field.value));
            }
        }
    }

    function serializeObject(elem) {
        return Object.keys(elem)
            .map(key => serializeItem(key, elem[key]));
    }

    function serializeItem(key, value) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
};

function CarregaPagina(destino, url, formulario) {
    var myLoadBar = new loadBar();

    if ($(".botoes-bar", $("#" + destino)).length > 0) {
        $(".botoes-bar", $("#" + destino)).append(myLoadBar);
    }
    else {
        $("#" + destino).prepend(myLoadBar);
    }

    if (destino == undefined) {
        alert('N�o foi poss�vel identificar o destino');
        return;
    }

    $('.nav-tabs a[href="#' + destino + '"]').tab('show');

    if (url == undefined) {
        alert('N�o foi poss�vel identificar a url');
        return;
    }

    var data = null;

    if (formulario != undefined && formulario != null) {
        wait(formulario);

        if (formulario.length > 0) {
            data = $(formulario).serialize();
        }
    }

    var ajaxCarregaPagina = $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function (xhr, textStatus, request) {
            if (request.getResponseHeader("erro") == "true") {
                window.location.href = xhr;
            }
            else {
                $('#' + destino).html(xhr);
                $('#' + destino).attr("url", url);
                tempoExecucao(destino);
                setTempoSessao();
                aplicarFormatos();
                voltarAoTopo();
            }
        },
        error: function (xhr) {
            var iframe = document.createElement('iframe');
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.style.display = "block";
            iframe.frameBorder = 0;
            iframe.src = "data:text/html;charset=utf-8," + escape(xhr.responseText);
            $('#' + destino).html(iframe);
            $('.nav-tabs a[href="#' + destino + '"]').tab('show');
        },
        complete: function () {
            $(myLoadBar).hide();
        }
    });
}

/**
 * Objetivo: Posiciona o cursor de edi��o sobre o primeiro campo dispon�vel de um formul�rio.
 * Sintaxe: <BODY onLoad="focusFirstField();">
*/
function dtn_init() {
    aplicarFormatos();
    setMaxLength();
    searchkeyup.init();

    document.onkeyup = function (event) {
        if (event.which == 13 || event.keyCode == 13) {
            if ($("#btn_Avancar:visible").length != 0)
                $("#btn_Avancar:visible").trigger("click");
            else
                $("#btn_C:visible").trigger("click");
        }
    };

    /**
     * Objetivo: Deixar smoth a ação de esconder do menu lateral do Extrato
     */
    $(".sidebar-toggle").click(function () {
        $(".sidebar-content").toggle("fast");
    });

    try {
        for (var i = 0; i < document.forms[0].length; i++) {
            var e = document.forms[0].elements[i];
            if ((!e.disabled) && (e.type != 'hidden') && (e.type != 'select-one') && (e.type != 'button') && (e.type != 'submit') && (e.type != 'radio')) {
                e.focus();
                return false;
            }
        }
    } catch (ex) { }
}

dtn_init();

/**
 * Objetivo: Alterar o tamanho da fonte do sistema.
*/
function insereTamanhoFonteBody(classeTamanho, classeTamanhoAnterior, retornarPadrao) {
    //inserir classe no body geral
    let bodyPrincipal = document.body.classList;

    //quando não for para retornar ao padrão, adiciona a nova classe ao body
    if (!retornarPadrao) {
        bodyPrincipal.add(classeTamanho);
    }

    //se a classeAnterior for nula ou tiver atingido o limite (a nova é igual a anterior), a classe anterior não deve ser removida
    if (classeTamanhoAnterior && classeTamanho != classeTamanhoAnterior) {
        bodyPrincipal.remove(classeTamanhoAnterior);
    }

    //inserir classe no body de cada iframe
    let iframes = document.querySelectorAll("iframe");
    //percorre os iframes abertos
    iframes.forEach((element) => {
        let iframeCarregado = element.contentWindow.document.body;
        if (iframeCarregado) {
            //quando não for retornar ao padrão, adiciona a nova classe ao body
            if (!retornarPadrao) {
                iframeCarregado.classList.add(classeTamanho);
            }

            if (classeTamanhoAnterior && classeTamanho != classeTamanhoAnterior) {
                iframeCarregado.classList.remove(classeTamanhoAnterior);
            }
        } else {
            //aguarda o carregamento dos iframes
            element.onload = function () {
                let bodyElement = element.contentWindow.document.body;
                if (!retornarPadrao) {
                    bodyElement.classList.add(classeTamanho);
                }

                if (classeTamanhoAnterior && classeTamanho != classeTamanhoAnterior) {
                    bodyElement.classList.remove(classeTamanhoAnterior);
                }
            };
        }
        let iframesDentroDoIframe = element.contentWindow.document.querySelectorAll("iframe");
        //percorre os iframes de dentro dos iframes
        iframesDentroDoIframe.forEach((el) => {
            let iframeCarregadoDentroDoIframe = el.contentWindow.document.body;
            if (iframeCarregadoDentroDoIframe) {
                if (!retornarPadrao) {
                    iframeCarregadoDentroDoIframe.classList.add(classeTamanho);
                }

                if (classeTamanhoAnterior && classeTamanho != classeTamanhoAnterior) {
                    iframeCarregadoDentroDoIframe.classList.remove(classeTamanhoAnterior);
                }
            } else {
                //aguarda o carregamento dos iframes
                element.onload = function () {
                    let bodyElement = el.contentWindow.document.body;
                    if (!retornarPadrao) {
                        bodyElement.classList.add(classeTamanho);
                    }

                    if (classeTamanhoAnterior && classeTamanho != classeTamanhoAnterior) {
                        bodyElement.classList.remove(classeTamanhoAnterior);
                    }
                };
            }
        });
    });
}
//retorna a classe da fonte que está sendo usada e será substituída
function verificaTamanhoFonteAtual() {
    let tamanhoFonte = document.querySelectorAll('body[class*=body]');
    if (tamanhoFonte.length >= 1) {
        for (var i = 0; i < tamanhoFonte.length; i++) {
            if (tamanhoFonte[i].classList.contains('body-sx')) {
                return 'body-sx'
            } else if (tamanhoFonte[i].classList.contains('body-sm')) {
                return 'body-sm'
            } else if (tamanhoFonte[i].classList.contains('body-md')) {
                return 'body-md'
            } else if (tamanhoFonte[i].classList.contains('body-lg')) {
                return 'body-lg'
            }

        }
    } else {
        return null;
    }
}
//define o próximo tamanho de fonte de acordo com a ação de aumentar/reduzir
function verificaNovoTamanho(tamanhoAtual, acao) {
    if (acao == "reduzir") {
        if (tamanhoAtual == "body-sx" || tamanhoAtual == 'body-sm' || !tamanhoAtual) {
            return 'body-sx'
        } else if (tamanhoAtual == 'body-md') {
            return 'body-sm'
        } else if (tamanhoAtual == 'body-lg') {
            return 'body-md'
        }
    } else if (acao == "aumentar") {
        if (tamanhoAtual == "body-lg" || tamanhoAtual == 'body-md') {
            return 'body-lg'
        } else if (tamanhoAtual == 'body-sm') {
            return 'body-md'
        } else if (tamanhoAtual == 'body-sx' || !tamanhoAtual) {
            return 'body-sm'
        }
    }
}