(function () {
    function remove(scope, selector) {
        let els = scope.querySelectorAll(selector);
        if (els != null) {
            els.forEach((el) => el.parentNode.removeChild(el));
        }
    }

    function removeClass(scope, selector, classToRemove) {
        classToRemove.split(" ").forEach(function (c) {
            let els = scope.querySelectorAll(selector);
            if (els != null) {
                els.forEach((item) => item.classList.remove(c));
            }
        });
    }

    function addClass(scope, selector, classToAdd) {
        let els = scope.querySelectorAll(selector);
        if (els != null) {
            els.forEach((item) => item.classList.add(classToAdd));
        }
    }

    function replaceClass(scope, selector, classToRemove, classToAdd) {
        let els = scope.querySelectorAll(selector);
        if (els != null) {
            els.forEach(function (item) {
                classToRemove.split(" ").forEach((c) => item.classList.remove(c));
                classToAdd.split(" ").forEach((c) => item.classList.add(c));
            });
        }
    }

    function buscarPagina(NomePagina) {
        window.event.cancelBubble = true;

        let boxResultado = document.querySelector("#busca-pagina-resultado-box");

        if (NomePagina.length < 3) {
            boxResultado.innerHTML = "";
            return;
        }

        let params = {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded"
            }),
            mode: 'cors',
            cache: 'default',
            body: serialize({
                Acao: "BuscarPagina",
                NomePagina: NomePagina
            })
        }

        fetch("/arearestrita/AuxTelaInicial.cshtml", params)
            .then(status)
            .then(res => res.json())
            .then(trataErro)
            .then(adicionaItens)
            .then(hideDropDown)
            .catch(handleErrors);

        function status(response) {
            if (response.status == 200) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }

        function trataErro(response) {
            if (response.DeuErro == "N") {
                return Promise.resolve(response);
            } else {
                return Promise.reject(new Error(response.MsgErro));
            }
        }

        function hideDropDown() {
            document.querySelector('#dropdown-tela-inicial').style.display = "none";
        }

        function adicionaItens(response) {
            if (response.ListaPagina != null) {
                boxResultado.innerHTML = "";
                let itens = Array.from(response.ListaPagina);
                itens.forEach(createItem);
            } else {
                return Promise.reject(new Error("Nenhum registro encontrado"));
            }

            function createItem(item) {
                let obj = itemToObj(item);
                boxResultado.appendChild(obj);
            }

            function itemToObj(item) {
                return new DOMParser().parseFromString(`<a href="#" id="pagina${item.idPagina}" class="${item.CorTelaInicial} ${item.TamanhoTelaInicial} box opentab fixarTelaInicial-0" data-url="${item.CodigoSistema}/${item.CodigoModulo}/${item.CodigoPagina}.cshtml" data-caption="${item.CaptionPagina}" data-idPagina="${item.idPagina}" data-forTelaInicial="${item.CorTelaInicial}" data-tamanhoTelaInicial="${item.TamanhoTelaInicial}" data-fixarTelaInicial="0" data-podeRemoverTelaInicial="${item.PodeRemoverTelaInicial}" data-title="${item.CodigoSistema} / ${item.CodigoModulo} / ${item.CodigoPagina}"><i class="icon fas ${item.IconePagina}"></i><div class="caption"><div class="caption-modulo">${item.CaptionModulo.toUpperCase()}</div><div class="caption-pagina">${item.CaptionPagina}</div></div></a>`, "text/html").firstChild;
            }
        }

        function handleErrors(err) {
            if (err.message.indexOf('/login.cshtml') > 0) {
                window.location.replace('/controleacesso/expirou.cshtml')
            } else {
                boxResultado.innerHTML = err.message;
            }
        }
    }

    function ativarContextMenuItem(item) {
        item.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const box = e.target.closest('.box');

            const idPagina = box.getAttribute("data-idPagina");
            const podeRemoverTelaInicial = box.getAttribute("data-podeRemoverTelaInicial");
            const fixarTelaInicial = box.getAttribute("data-fixarTelaInicial");
            const tamanhoTelaInicial = box.getAttribute("data-tamanhoTelaInicial");
            const corTelaInicial = box.getAttribute("data-corTelaInicial");

            document.form1.idPagina.value = idPagina;

            if (podeRemoverTelaInicial == "1") {
                if (fixarTelaInicial == "1") {
                    hide(document.querySelector("#dropdown-fixarTelaInicial-1"));
                    show(document.querySelector("#dropdown-fixarTelaInicial-0"));
                } else {
                    hide(document.querySelector("#dropdown-fixarTelaInicial-0"));
                    show(document.querySelector("#dropdown-fixarTelaInicial-1"));
                }
            } else {
                hide(document.querySelector("#dropdown-fixarTelaInicial-0"));
                hide(document.querySelector("#dropdown-fixarTelaInicial-1"));
            }

            removeClass(document, ".dropdown-cor-checked.checked", "checked");
            removeClass(document, ".dropdown-tamanho-checked.checked", "checked");

            addClass(document, `#dropdown-tamanho-${tamanhoTelaInicial}`, "checked");
            addClass(document, `#dropdown-cor-${corTelaInicial}`, "checked");

            let dropdown = document.querySelector("#dropdown-tela-inicial");
            dropdown.style.display = "";
            dropdown.style.left = e.clientX + "px";
            dropdown.style.top = (e.clientY - dropdown.scrollHeight) + "px";
        });
    }

    function ativarContextMenu() {
        document.querySelectorAll('.box').forEach(ativarContextMenuItem);

        document.querySelector('body').addEventListener("click", function () {
            hide(document.querySelector('#dropdown-tela-inicial'));
        });
    }

    function alterarFixarTelaInicial(fixarTelaInicial) {
        window.event.cancelBubble = true;

        let idPagina = document.form1.idPagina.value;

        let params = {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded"
            }),
            mode: 'cors',
            cache: 'default',
            body: serialize({
                acao: "AlterarFixarTelaInicial",
                idPagina: idPagina,
                fixarTelaInicial: fixarTelaInicial
            })
        }

        let loading = function () {
            let area = document.querySelector(`#icone-status-fixar-${fixarTelaInicial}`);
            let spinner = new loadSpinner();

            function start() {
                area.appendChild(spinner);
            }

            function stop() {
                area.removeChild(spinner);
            }

            return {
                start: start,
                stop: stop
            }
        }();

        loading.start();

        fetch('/arearestrita/AuxTelaInicial.cshtml', params)
            .then(status)
            .then(response => response.json())
            .then(erro)
            .then(alteraPagina)
            .then(hideDropDown)
            .then(stopLoading)
            .catch(handleErrors)

        function status(response) {
            if (response.status == 200) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }

        function erro(response) {
            if (response.DeuErro == "N") {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.MsgErro))
            }
        }

        function alteraPagina() {
            let el = document.querySelector(`#pagina${idPagina}`);

            if (fixarTelaInicial == '0') {
                el.parentNode.removeChild(el);
                el.setAttribute("data-fixarTelaInicial", fixarTelaInicial);
            } else {
                el.className = el.className.replace("fixarTelaInicial-0", "");
                el.className += " fixarTelaInicial-1";
                el.setAttribute("data-fixarTelaInicial", fixarTelaInicial);
                el.style.display = "none";
            }
        }

        function hideDropDown() {
            hide(document.querySelector('#dropdown-tela-inicial'));
        }

        function stopLoading() {
            loading.stop();
        }

        function handleErrors(err) {
            if (err.message.indexOf('/login.cshtml') > 0) {
                window.location.replace('/controleacesso/expirou.cshtml');
            } else {
                document.querySelector("#start").innerHTML += `<div class="msgErro">alterarFixarTelaInicial. Pedido falhou. Retorno do status de ${err.message}</div>`;
            }
        }
    }

    function alterarTamanhoTelaInicial(TamanhoTelaInicial) {
        window.event.cancelBubble = true;

        let idPagina = document.form1.idPagina.value;

        let loading = function () {
            let area = document.querySelector(`#icone-status-tamanho-${TamanhoTelaInicial}`);
            let spinner = new loadSpinner();

            function start() {
                area.appendChild(spinner);
            }

            function stop() {
                area.removeChild(spinner);
            }

            return {
                start: start,
                stop: stop
            }
        }();

        let params = {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded"
            }),
            mode: 'cors',
            cache: 'default',
            body: serialize({
                acao: "AlterarTamanhoTelaInicial",
                idPagina: idPagina,
                tamanhoTelaInicial: TamanhoTelaInicial
            })
        }

        loading.start();

        fetch('/arearestrita/AuxTelaInicial.cshtml', params)
            .then(status)
            .then(res => res.json())
            .then(erro)
            .then(alteraTamanho)
            .then(hideDropDown)
            .then(stopLoading)
            .catch(handleErrors)

        function status(response) {
            if (response.status == 200) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }

        function erro(response) {
            if (response.DeuErro == "N") {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.MsgErro))
            }
        }

        function alteraTamanho() {
            replaceClass(document, `#pagina${idPagina}`, "pequeno medio largo grande", TamanhoTelaInicial);
            document.querySelector(`#pagina${idPagina}`).setAttribute("data-tamanhoTelaInicial", TamanhoTelaInicial);
        }

        function hideDropDown() {
            hide(document.querySelector('#dropdown-tela-inicial'));
        }

        function stopLoading() {
            loading.stop();
        }

        function handleErrors(err) {
            if (err.message.indexOf('/login.cshtml') > 0) {
                window.location.replace('/controleacesso/expirou.cshtml');
            } else {
                document.querySelector("#start").innerHTML += `<div class="msgErro">alterarTamanhoTelaInicial. Pedido falhou. Retorno do status de ${err.message}</div>`;
            }
        }
    }

    function alterarCorTelaInicial(corTelaInicial) {
        window.event.cancelBubble = true;

        const idPagina = document.form1.idPagina.value;

        let loading = function () {
            let area = document.querySelector(`#icone-status-cor-${corTelaInicial}`);
            let spinner = new loadSpinner();

            function start() {
                area.appendChild(spinner);
            }

            function stop() {
                area.removeChild(spinner);
            }

            return {
                start: start,
                stop: stop
            }
        }();

        let params = {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded"
            }),
            mode: 'cors',
            cache: 'default',
            body: serialize({
                acao: "AlterarCorTelaInicial",
                idPagina: idPagina,
                corTelaInicial: corTelaInicial
            })
        }

        loading.start();

        fetch('/arearestrita/AuxTelaInicial.cshtml', params)
            .then(status)
            .then(res => res.json())
            .then(erro)
            .then(alteraCor)
            .then(hideDropDown)
            .then(stopLoading)
            .catch(handleErrors)

        function status(response) {
            if (response.status == 200) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }

        function erro(response) {
            if (response.DeuErro == "N") {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.MsgErro))
            }
        }

        function alteraCor() {
            replaceClass(document, `#pagina${idPagina}`, "cor1 cor2 cor3 cor4 cor5 cor6 cor7 cor8 cor9 cor10 cor11 cor12", corTelaInicial);
            document.querySelector("#pagina" + idPagina).setAttribute("data-corTelaInicial", corTelaInicial);
        }

        function hideDropDown() {
            hide(document.querySelector('#dropdown-tela-inicial'));
        }

        function stopLoading() {
            loading.stop();
        }

        function handleErrors(err) {
            if (err.message.indexOf('/login.cshtml') > 0) {
                window.location.replace('/controleacesso/expirou.cshtml');
            } else {
                document.querySelector("#start").innerHTML += `<div class="msgErro">alterarCorTelaInicial. Pedido falhou. Retorno do status de ${err.message}</div>`;
            }
        }
    }

    function alterarOrdemTelaInicial(listaIdPaginaTelaInicial, listaColunaTelaInicial, listaOrdemTelaInicial) {
        window.event.cancelBubble = true;

        let params = {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded"
            }),
            mode: 'cors',
            cache: 'default',
            body: serialize({
                acao: "AlterarOrdemTelaInicial",
                listaIdPaginaTelaInicial: listaIdPaginaTelaInicial,
                listaColunaTelaInicial: listaColunaTelaInicial,
                listaOrdemTelaInicial: listaOrdemTelaInicial,
            })
        }

        fetch('/arearestrita/AuxTelaInicial.cshtml', params)
            .then(status)
            .catch(err => {
                if (err.message.indexOf('/login.cshtml') > 0) {
                    window.location.replace('/controleacesso/expirou.cshtml');
                } else {
                    document.querySelector("#start").innerHTML += `<div class="msgErro">AlterarOrdemTelaInicial. Pedido falhou. Retorno do status de ${err.message}</div>`;
                }
            })

        function status(response) {
            if (response.status == 200) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }
    }

    function mostrarBusca() {
        hide(document.querySelectorAll(".fixarTelaInicial-1"));
        hide(document.querySelectorAll('.adicionar-pagina'));
        show(document.querySelector('#container-busca-pagina'));

        let el = document.querySelector('#BuscarPagina');
        if (el != null) {
            el.value = "";
            el.focus();
        }
    }

    function fecharBusca() {
        show(document.querySelectorAll('.icon'));
        show(document.querySelectorAll('.adicionar-pagina'));
        hide(document.querySelector('#dropdown-tela-inicial'));
        hide(document.querySelector('#container-busca-pagina'));
        show(document.querySelectorAll(".fixarTelaInicial-1"));
        remove(document, ".fixarTelaInicial-0");

        let els = document.querySelectorAll("#busca-pagina-resultado-box .box");
        if (els != null) {
            let destino = document.querySelector("#sortable1");
            els.forEach((el) => destino.append(el));
        }
    }

    function mostraHeader() {
        document.querySelector('#HeaderCheck').checked = !document.querySelector('#HeaderCheck').checked;

        if (document.querySelector('#HeaderCheck').checked) {
            show(document.querySelector('#nav'));
            show(document.querySelector('#Extratos'));
            show(document.querySelector('#dir'));
        } else {
            hide(document.querySelector('#nav'));
            hide(document.querySelector('#Extratos'));
            hide(document.querySelector('#dir'));
        }
    }

    function contagemRegressivaTempoSessao() {
        let contoleTempoSessao = function () {
            // pega a string da timeout
            let timeout = document.getElementById("timeout").innerHTML;

            // inicializa o tempo
            let tempo = 0;

            // se a sessão não tiver expirado
            if (timeout != "Sua sessão expirou!") {
                // converte o tempo para inteiro
                tempo = parseInt(timeout.substring(0, 2) * 60) + parseInt(timeout.substring(3, 5));

                // diminui o tempo
                tempo--;
            }

            // Se o tempo não for zerado
            if ((tempo - 1) >= 0) {
                // Pega a parte inteira dos minutos
                let min = parseInt(tempo / 60);

                // Calcula os segundos restantes
                let seg = tempo % 60;

                // Formata o nÃºmero menor que dez, ex: 08, 07,
                if (min < 10) {
                    min = "0" + min;
                    min = min.substr(0, 2);
                }

                // Formata os segundos menor que dez, ex: 08, 07,
                if (seg <= 9) {
                    seg = "0" + seg;
                }

                // Cria a variável para formatar no estilo hora/cronômetro
                horaImprimivel = min + ':' + seg;

                //JQuery pra setar o valor
                $("#timeout").html(horaImprimivel);
                // Quando o contador chegar a zero faz esta ação
            } else {
                $("#timeout").html('Sua sessão expirou!');
                clearInterval(contoleTempoSessao);
            }
        }

        // Define que a função será executada novamente em 1000ms = 1 segundo
        setInterval(contoleTempoSessao, 1000);
    }

    function mostraListaNotificacoes() {
        if (document.getElementById("listaNotificacoes").style.display != 'none' ||
            document.getElementById("TextoNotificacao").style.display != 'none') {
            document.getElementById("listaNotificacoes").style.display = 'none';
            document.getElementById('TextoNotificacao').style.display = 'none';
            document.getElementById("MenuNotificacoes").style.background = '';
        } else {
            document.getElementById("listaNotificacoes").style.display = 'block';
            document.getElementById("MenuNotificacoes").style.background = '#2a3235';
            document.getElementById('TextoNotificacao').style.display = 'none';
        }
    }

    function procuraNotificacoes() {
        const ContadorNotificacao = parseInt(document.getElementById('ContadorNotificacao').value);

        let params = {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded"
            }),
            mode: 'cors',
            cache: 'default',
            body: serialize({
                Acao: "C_PROCURA_NOTIFICACAO"
            })
        }

        fetch('/arearestrita/AuxTelaInicial.cshtml', params)
            .then(status)
            .then(res => res.json())
            .then(createNotificacao)
            .then(searchNotificacao)
            .catch(err => console.log(err.message))

        function createNotificacao(response) {
            if (response.length == 1) {
                const quantNaoLidas = response[0].QuantidadeNotificacoesNaoLidas;

                if (quantNaoLidas > ContadorNotificacao) {
                    document.getElementById('ContadorNotificacao').value = quantNaoLidas;
                    MontaListaNotificacoes();
                }

                if (quantNaoLidas > 0) {
                    document.querySelector('#QuantNaoLidas').innerHTML = (' ' + quantNaoLidas + ' ');
                    show(document.querySelector('#QuantNaoLidas'));
                    show(document.querySelector('#AlertaHeader'));
                }
            }
        }

        function searchNotificacao() {
            // procurar notificações a cada 25 minutos
            setTimeout(procuraNotificacoes, 25 * 60 * 1000);
        }

        function status(response) {
            if (response.status == 200) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }
    }

    function MontaListaNotificacoes() {
        let params = {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded"
            }),
            mode: 'cors',
            cache: 'default',
            body: serialize({
                Acao: "C_NOTIFICACOES"
            })
        }

        fetch('/arearestrita/AuxTelaInicial.cshtml', params)
            .then(status)
            .then(res => res.json())
            .then(hasItens)
            .then(createItens)
            .then(setQuantidadeNaoLidas)
            .then(todasLidas)
            .catch(handleErrors)

        function status(response) {
            if (response.status == 200) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }

        function hasItens(response) {
            if (response.length > 0) {
                return Promise.resolve(response);
            } else {
                return Promise.reject(new Error("Não há notificações para o operador"));
            }
        }

        function handleErrors(err) {
            var li = document.createElement("li");
            li.innerHTML = `<span class="nivel"><a href="#">${err.message}</a></span>`;
            document.querySelector('#listaNotificacoes').append(li);
        }

        function createItens(response) {
            for (var i = 0; i < response.length; i++) {
                createItem(response[i]);
            }
            //response.foreach(createItem);
        }

        function setQuantidadeNaoLidas(response) {
            /*document.querySelector('#QuantNaoLidas').innerHTML = response.QuantidadeNotificacoesNaoLidas;*/
        }

        function todasLidas(response) {
            //if (response.QuantidadeNotificacoesNaoLidas == 0) {
            //    hide(document.querySelector('#QuantNaoLidas'));
            //    hide(document.querySelector('#AlertaHeader'));
            //}
        }

        function createItem(item) {
            let listaNotificacoes = document.getElementById("listaNotificacoes");
            const id = item.TipoNotificacao + item.IdNotificacao;
            let notificacao = listaNotificacoes.querySelector(`#${id}`);

            if (notificacao == null) {
                let li = document.createElement("li");

                li.id = item.TipoNotificacao + item.IdNotificacao;

                li.addEventListener("click", function () {
                    ExibeNotificacao(item.IdNotificacao, item.TipoNotificacao);
                })

                li.innerHTML = `<span class="nivel"><a href="#">${item.Titulo}</a><img src="/Imagens/visualizado2.png" id="${id}Visualizado" style="display: none;"/></span>`;

                listaNotificacoes.appendChild(li);

                if (item.Visualizado) {
                    hide(document.querySelectorAll(`${id}Visualizado`));
                }
            }
        }
    }

    function ExibeNotificacao(IdNotificacao, TipoNotificacao) {
        let params = {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded"
            }),
            mode: 'cors',
            cache: 'default',
            body: serialize({
                Acao: "C_NOTIFICACAO",
                IdNotificacao: IdNotificacao,
                TipoNotificacao: TipoNotificacao
            })
        }

        limparNotificacao();

        fetch('/arearestrita/AuxTelaInicial.cshtml', params)
            .then(status)
            .then(res => res.json())
            .then(criaNotificacao)
            .catch(err => console.log(err))

        function status(response) {
            if (response.status == 200) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }

        if (IdNotificacao != "") {
            document.getElementById('listaNotificacoes').style.display = 'none';
            document.getElementById('TextoNotificacao').style.display = 'block';
        }

        if (document.getElementById('ContadorNotificacao').value - 1 > 0) {
            document.querySelector('#QuantNaoLidas').innerHTML = (' ' + document.getElementById('ContadorNotificacao').value - 1 + ' ');
            document.getElementById('ContadorNotificacao').value = document.getElementById('ContadorNotificacao').value - 1;
        } else {
            document.querySelector('#QuantNaoLidas').innerHTML = '';
            hide(document.querySelector('#QuantNaoLidas'));
        }
        hide(document.querySelector('#SUP' + IdNotificacao));

        function limparNotificacao() {
            document.querySelector('#PublicadoEm').innerHTML = '';
            document.querySelector('#Mensagem').innerHTML = '';
            document.querySelector('#LinkNotificacao').innerHTML = '';
        }

        function criaNotificacao(data) {
            if (data.length == 0) {
                document.querySelector('#PublicadoEm').innerHTML = '';
                document.querySelector('#Mensagem').innerHTML = '[ERRO] NOTIFICAÇÃO NÃO ENCONTRADA';
                document.querySelector('#LinkNotificacao').innerHTML = '';
            } else if (data.length == 1) {
                document.querySelector('#Mensagem').innerHTML = data[0].Mensagem;
                document.querySelector('#PublicadoEm').innerHTML = `Publicado em: ${data[0].PublicadoEm}`;
                //document.querySelector('#QuantNaoLidas').innerHTML = ` ${data[0].QuantidadeNotificacoesNaoLidas} `;

                if (data[0].TipoNotificacao == 'SUP') {
                    if (data[0].LinkNotificacao != "") {
                        document.querySelector("#idChamadoConsulta").value = data[0].LinkNotificacao;

                        document.querySelector("#LinkNotificacao").innerHTML = `<a href="#" onclick="document.getElementById('listaNotificacoes').style.display='none';document.getElementById('TextoNotificacao').style.display='none';document.getElementById('MenuNotificacoes').style.background=''; abrirAba('Generico/Suporte/Chamados.cshtml','','','');">Clique para visualizar</a>`;                        

                        /*?idChamado=${data[0].LinkNotificacao}*/
                    }
                }

                if (data[0].QuantidadeNotificacoesNaoLidas == 0) {
                    hide(document.querySelector('#QuantNaoLidas'));
                    hide(document.querySelector('#AlertaHeader'));
                }

                if (data[0].Visualizado = 1) {
                    const id = data[0].TipoNotificacao + data[0].IdNotificacao + 'Visualizado';
                    hide(document.getElementById(id));
                }
            }
        }
    }


    function sortableColumns() {
        $(".col").sortable({
            forcePlaceholderSize: true,
            connectWith: ".connectedSortable",
            placeholder: "box ui-state-highlight",
            start: function () {
                let cols = document.querySelectorAll('.col');
                cols.forEach(addHighlight)

                function addHighlight(col) {
                    if (col.children.length == 0) {
                        col.classList.add('ui-state-highlight');
                    }
                }
            },
            stop: function () {
                removeClass(document, '.col', 'ui-state-highlight');

                let Ordem = 1;
                let ColunaTelaInicial = 1;
                let virgula = "";
                let ListaOrdemTelaInicial = "";
                let ListaColunaTelaInicialTelaInicial = "";
                let ListaIdPaginaTelaInicial = "";
                let ColunaTelaInicialAnt = 0;

                let boxes = document.querySelectorAll('.box');
                Array.from(boxes).forEach(eachBox);

                function eachBox(item) {
                    ColunaTelaInicial = parseInt(item.parentNode.getAttribute("data-colunaTelaInicial"));

                    if (ColunaTelaInicial == ColunaTelaInicialAnt) {
                        Ordem = Ordem + 1
                    } else {
                        Ordem = 1
                    }

                    ListaColunaTelaInicialTelaInicial = ListaColunaTelaInicialTelaInicial + virgula + ColunaTelaInicial;
                    ListaIdPaginaTelaInicial = ListaIdPaginaTelaInicial + virgula + item.getAttribute("data-idPagina");
                    ListaOrdemTelaInicial = ListaOrdemTelaInicial + virgula + Ordem;
                    virgula = ",";
                    ColunaTelaInicialAnt = ColunaTelaInicial;
                }

                alterarOrdemTelaInicial(ListaIdPaginaTelaInicial, ListaColunaTelaInicialTelaInicial, ListaOrdemTelaInicial);
            }
        }).disableSelection();
    }

    // Helper function to get an element's exact position
    function getPosition(el) {
        var xPos = 0;
        var yPos = 0;

        while (el) {
            if (el.tagName == "BODY") {
                // deal with browser quirks with body/window/document and page scroll
                var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                var yScroll = el.scrollTop || document.documentElement.scrollTop;

                xPos += (el.offsetLeft - xScroll + el.clientLeft);
                yPos += (el.offsetTop - yScroll + el.clientTop);
            } else {
                // for all other non-BODY elements
                xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                yPos += (el.offsetTop - el.scrollTop + el.clientTop);
            }

            el = el.offsetParent;
        }
        return {
            x: xPos,
            y: yPos
        };
    }

    function changeCiretran() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/arearestrita/frameMudaCiretran.cshtml', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'text';
        xhr.onload = function () {
            if (xhr.status != 200) {
                alert(xhr.responseText);
            }
        }

        let params = encodeURI(`idCiretran=${this.value}`);
        xhr.send(params);
    }

    function changeOrgaoConsignataria() {

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/arearestrita/frameMudaOrgaoConsignataria.cshtml', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'text';
        xhr.onload = function () {
            if (xhr.status != 200) {
                alert(xhr.responseText);
            }
        }

        let params = encodeURI(`idOrgao=${this.value}`);
        xhr.send(params);
    }

    function changeCredenciamento() {

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/arearestrita/frameMudaCredenciamento.cshtml', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'text';
        xhr.onload = function () {
            if (xhr.status != 200) {
                alert(xhr.responseText);
            }
        }

        let params = encodeURI(`idCredenciamento=${this.value}`);
        xhr.send(params);
    }

    function adicionaEventos() {
        Array.from(document.querySelectorAll('.js-mostraHeader')).forEach(function (item) {
            item.addEventListener("click", mostraHeader);
        });

        Array.from(document.querySelectorAll('.js-mostrarBusca')).forEach(function (item) {
            item.addEventListener("click", mostrarBusca);
        });

        Array.from(document.querySelectorAll('.js-fecharBusca')).forEach(function (item) {
            item.addEventListener("click", fecharBusca);
        });

        Array.from(document.querySelectorAll('.js-mostraListaNotificacoes')).forEach(function (item) {
            item.addEventListener("click", mostraListaNotificacoes);
        });

        Array.from(document.querySelectorAll('.js-buscarPagina')).forEach(function (item) {
            item.addEventListener("keyup", function () {
                buscarPagina(this.value)
            });
        });

        Array.from(document.querySelectorAll('.js-ativarContextMenu')).forEach(function (item) {
            item.addEventListener("blur", ativarContextMenu);
        });

        Array.from(document.querySelectorAll('.js-alterarCorTelaInicial')).forEach(function (item) {
            item.addEventListener("click", function () {
                alterarCorTelaInicial(
                    this.getAttribute("data-corTelaInicial")
                )
            });
        });

        Array.from(document.querySelectorAll('.js-alterarTamanhoTelaInicial')).forEach(function (item) {
            item.addEventListener("click", function () {
                alterarTamanhoTelaInicial(
                    this.getAttribute("data-tamanhoTelaInicial")
                )
            });
        });

        Array.from(document.querySelectorAll('.js-alterarFixarTelaInicial')).forEach(function (item) {
            item.addEventListener("click", function () {
                alterarFixarTelaInicial(
                    this.getAttribute("data-fixarTelaInicial")
                )
            });
        });

        Array.from(document.querySelectorAll("[aria-label='Search']")).forEach(function (item) {
            if (item.getAttribute("aria-describedby") != undefined && item.getAttribute("aria-describedby") != "") {
                item.addEventListener("keyup", function (event) {
                    // Number 13 is the "Enter" key on the keyboard
                    if (event.keyCode === 13) {
                        // Cancel the default action, if needed
                        event.preventDefault();
                        // Trigger the button element with a click
                        document.getElementById(item.getAttribute("aria-describedby")).click();
                    }
                });
            }
        });

        Array.from(document.querySelectorAll('.js-changeOrgaoConsignataria')).forEach(function (item) {
            item.addEventListener("change", changeOrgaoConsignataria);
        });

        Array.from(document.querySelectorAll('.js-changeCiretran')).forEach(function (item) {
            item.addEventListener("change", changeCiretran);
        });

        Array.from(document.querySelectorAll('.js-changeCredenciamento')).forEach(function (item) {
            item.addEventListener("change", changeCredenciamento);
        });
    }

    var tabInc = 0;

    function opentab() {
        var tabs = $("#tabs").tabs();

        $("body").delegate('.opentab', 'click', function () {
            const tab_max = 20;

            // Limita a quantidade de abas abertas
            if (tabs.find('li').length >= tab_max) {
                alert('A capacidade máxima do sistema são ' + tab_max + ' abas.');
                return;
            }

            const obj = $(this);
            let url = $(obj).attr("data-url");
            let title = $(obj).attr("data-title");
            let caption = $(obj).attr("data-caption");

            let isAbaAberta = false;
            let idPagina = $(obj).attr("data-idPagina");
            let tabId = "tab-" + idPagina;
            let erro = false;

            // Verifica se a página já está aberta
            if (tabs.find("#" + tabId).length > 0) {
                isAbaAberta = true;
            }
            // se for uma página de extrato
            else if (idPagina == 'extrato') {
                // pesquisar aba aberta procurando pelo título do extrato
                $('.ui-tabs-nav li').each(function (index, element) {
                    // verificar se o título da tela solicitada é igual o title da tela atual
                    if (title == $(element).children('a').attr('title')) {
                        isAbaAberta = true;
                        tabId = element.id;
                    }
                });

                // se a aba de extrato não tiver aberta
                // é preciso abrir uma nova aba com um novo Id
                if (!isAbaAberta) {
                    tabInc += 1;
                    idPagina = "extrato-" + tabInc;

                    const parametro = $("#InputConsultaExtrato").val().replace(/\s/g, '');

                    if (!parametro) return;

                    $.ajax({
                        type: "POST",
                        url: "/arearestrita/AuxTelaInicial.cshtml",
                        dataType: "json",
                        async: false,
                        data: {
                            acao: "ValidaParametroExtrato",
                            parametroExtrato: parametro
                        },
                        success: function (response) {
                            if (response.Url != null) {
                                url = response.Url + "?Parametro=" + parametro;
                                title = "Extrato " + parametro;
                                caption = "Extrato " + parametro;
                            } else {
                                alert(response.Retorno);
                                erro = true;
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            alert("Erro interno da aplicação:\nAvise à equipe de suporte\nParametro = " + parametro);
                            erro = true;
                        }
                    })
                }
            }

            if (erro) return;

            $('#start').hide();
            $('#tabs').show();
            $('#InputConsultaExtrato').val('');

            if (isAbaAberta) {
                activateTab(tabId);
                return;
            }

            // Se ainda não foi criada nenhuma aba
            if (tabs.find('li').length == 0) {
                // criar aba tela inicial
                createTab({
                    id: 0,
                    title: "Tela inicial",
                    caption: "<i class=\"fa fa-home\" style=\"font-size: 1.3em;\"></i>",
                    url: null
                });
            }

            // criar aba solicitada
            createTab({
                id: idPagina,
                title: title,
                caption: caption,
                url: url
            });

            activateTab(tabId);
        });

        function createTab(params) {
            let tabTemplate = "";

            const tabId = "tab-" + params.id;
            const panelId = "panel-" + params.id;

            // identificação da tela inicial
            if (params.id == 0) {
                // Tela inicial não pode ser fechada, não tem o "x" de fechar
                tabTemplate = "<li id='#{tabId}'><a href='#{href}' title='#{title}'>#{caption}</a></li>";
            } else {
                // Tela padrão pode ser fechada, tem o "x" de fechar
                tabTemplate = "<li id='#{tabId}'><div class='icon-close'><span></span></div><a href='#{href}' title='#{title}'>#{caption}</a></li>";
            }

            let li = tabTemplate.replace(/#\{href\}/g, "#" + panelId).replace(/#\{title\}/g, params.title).replace(/#\{caption\}/g, params.caption).replace(/#\{tabId\}/g, tabId);

            tabs.find(".ui-tabs-nav").append(li);

            if (params.url != null) {
                var panelHtml = `<div id="${panelId}"><iframe src="${params.url}" width='100%' marginwidth='0' marginheight='0' frameborder='0' hspace='0' vspace='0' height='99%'></iframe></div>`;
                tabs.append(panelHtml);
            }
        }

        function activateTab(id) {
            tabs.tabs("refresh");

            const index = tabs.find("#" + id).index();

            $("#tabs").tabs({ active: index });
        }

        // close icon: removing the tab on click
        tabs.delegate(".ui-tabs-nav li .icon-close", "click", function (e) {
            if (!e.target.classList.contains("icon-close")) return;

            var li = $(this).closest("li");
            var tabId = li.attr("id");
            var panelId = li.attr("aria-controls");
            var nextTabId = li.next().attr("id");
            var prevTabId = li.prev().attr("id");

            $("#" + tabId).remove();
            $("#" + panelId).remove();

            // quando tiver só 1 aba, significa que só tem a tela inicial
            if (tabs.find('li').length == 1) {
                // Remover tela inicial
                $("#tab-0").remove();
            }

            // Se não tiver nenhuma aba, mostrar a tela inicial
            if (tabs.find('li').length == 0) {
                $('#start').show();
                $('#tabs').hide();
            }

            // se tiver mais de uma aba aberta
            if (tabs.find('li').length > 1) {
                // selecionar aba ativa
                const activeTabs = $(".ui-tabs-nav li.ui-tabs-active");

                // se não tem nenhuma aba ativa
                if (activeTabs.length == 0) {
                    // ativar próxima aba, se existir
                    if (nextTabId != undefined) {
                        activateTab(nextTabId);
                    }
                    // ativar aba anterior, se existir
                    else if (prevTabId != undefined) {
                        activateTab(prevTabId);
                    }
                }
            }
        });

        tabs.delegate(".ui-tabs-nav li", "click", function (e) {
            if (e.target.classList.contains("icon-close")) return;

            if (this.getAttribute("id") == "tab-0") {
                $('#start').show();
                $('.ui-tabs-panel').hide();
            } else if (tabs.find('li').length > 0) {
                $('#start').hide();
            }

            Array.from(document.querySelectorAll('.ui-tabs-active')).forEach(function (item) {
                item.classList.remove('ui-tabs-active');
                item.classList.remove('ui-state-active');
            });

            $('#' + $(this).attr('aria-controls')).show();
            $(this).addClass('ui-tabs-active ui-state-active');
        });

        tabs.bind("keyup", function (event) {
            if (event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE) {
                var panelId = tabs.find(".ui-tabs-active").remove().attr("aria-controls");
                $("#" + panelId).remove();
                tabs.tabs("refresh");

                if (tabs.find('li').length == 0) {
                    $('#tabs').hide();
                    $('#start').show();
                }
            }
        });
    }

    function initNoticias() {
        const selector = "#start .items .box-post";
        const noticias = getNoticias();
        let index = getActiveIndex();
        let myTime;

        addEvents();

        clearTimeNoticia();

        function addEvents() {
            document.querySelectorAll(selector + " .prev").forEach(x => x.addEventListener("click", function () {
                event.preventDefault();
                event.stopPropagation();
                prev();
            }));

            document.querySelectorAll(selector + " .next").forEach(x => x.addEventListener("click", function () {
                event.preventDefault();
                event.stopPropagation();
                next();
            }));
        }

        function getNoticias() {
            return document.querySelectorAll(selector);
        }

        function getActiveIndex() {
            for (let noticia of noticias) {
                if (noticia.classList.contains("d-none")) {
                    return parseInt(noticia.getAttribute("data-index"));
                }
            }
        }

        function clearTimeNoticia() {
            clearInterval(myTime);
            myTime = setTimeout(next, 5000);
        }

        function prev() {
            index = index - 1;
            console.log(index);
            if (index < 0) {
                index = noticias.length - 1;
            }

            showNoticia();
            clearTimeNoticia();
        }

        function next() {
            index = index + 1;

            if (index >= noticias.length) {
                index = 0;
            }

            showNoticia();
            clearTimeNoticia();
        }

        function showNoticia() {
            for (var i = 0; i < noticias.length; i++) {
                if (i == index) {
                    noticias[i].classList.remove("d-none");
                }
                else {
                    noticias[i].classList.add("d-none");
                }
            }
        }
    }

    function initUtilitario() {
        var selected = null, // Object of the element to be moved
            x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
            x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element

        // Will be called when user starts dragging an element
        function _drag_init(elem) {
            // Store the object of the element which needs to be moved
            selected = elem;
            x_elem = x_pos - selected.offsetLeft;
            y_elem = y_pos - selected.offsetTop;
        }

        // Will be called when user dragging an element
        function _move_elem(e) {
            x_pos = document.all ? window.event.clientX : e.pageX;
            y_pos = document.all ? window.event.clientY : e.pageY;
            if (selected !== null) {
                selected.style.left = (x_pos - x_elem) + 'px';
                selected.style.top = (y_pos - y_elem) + 'px';
            }
        }

        // Destroy the object when we are done
        function _destroy() {
            selected = null;
        }

        // Bind the functions...
        document.querySelector('#utilitario .utilitario-title').onmousedown = function () {
            _drag_init(document.getElementById("utilitario"));
            return false;
        };

        document.onmousemove = _move_elem;
        document.onmouseup = _destroy;
    }

    function makeUtilitario() {
        initUtilitario();

        $('#utilitario_btn').click(function () {
            $("#utilitario").show();
        });

        $('#utilitario_close').click(function () {
            $("#utilitario").hide();
        });

        $('#utilitario_minimizar').click(function () {
            $("#utilitario_body").hide();
            $("#utilitario_maximizar").removeClass("d-none");
            $("#utilitario_minimizar").addClass("d-none");
        });

        $('#utilitario_maximizar').click(function () {
            $("#utilitario_body").show();
            $("#utilitario_maximizar").addClass("d-none");
            $("#utilitario_minimizar").removeClass("d-none");
        });

        $('.js-utilitario-somente-numeros').click(function () {
            var input = $("#utilitario-input").val();
            if (input.trim() != "") {
                $("#utilitario-result").html(input.match(/\d+/g));
            }
        });

        $('.js-utilitario-placa').click(function () {
            var input = $("#utilitario-input").val().toUpperCase();
            if (input.trim() != "") {
                var placa = input.substr(0, 4) + swap(input.substr(4, 1)) + input.substr(5, 2);
                $("#utilitario-result").html(placa);
            }

            function swap(expr) {
                switch (expr) {
                    case '0': return 'A';
                    case '1': return 'B';
                    case '2': return 'C';
                    case '3': return 'D';
                    case '4': return 'E';
                    case '5': return 'F';
                    case '6': return 'G';
                    case '7': return 'H';
                    case '8': return 'I';
                    case '9': return 'J';
                    case 'A': return '0';
                    case 'B': return '1';
                    case 'C': return '2';
                    case 'D': return '3';
                    case 'E': return '4';
                    case 'F': return '5';
                    case 'G': return '6';
                    case 'H': return '7';
                    case 'I': return '8';
                    case 'J': return '9';
                }
            }
        });

        $('.js-utilitario-limpar').click(function () {
            $("#utilitario-input").val("");
            $("#utilitario-result").html("");
        });
    }

    function init() {
        adicionaEventos();

        initNoticias();

        opentab();

        sortableColumns();

        ativarContextMenu();

        setTempoSessao();

        contagemRegressivaTempoSessao();

        procuraNotificacoes();

        makeUtilitario();

        $(".nav-tabs").on("click", "a", function (e) {
            e.preventDefault();
            $(this).tab('show');
        });

        $(".nav-tabs").on("click", "span", function () {
            var anchor = $(this).siblings('a');
            $(anchor.attr('href')).remove();
            $(this).parent().remove();
            $(".nav-tabs li").children('a').first().click();
        });

        document.onkeyup = function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                if ($("#btn_Avancar:visible").length != 0)
                    $("#btn_Avancar:visible").trigger("click");
                else
                    $("#btn_C:visible").trigger("click");
            }
        };
    }

    return {
        init: init
    }
})().init();