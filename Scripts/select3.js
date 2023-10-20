function select3(selector, callback) {
    this.scope = document.getElementById(selector);
    this.elems = scope.querySelectorAll("ul li");
    this.input = scope.querySelector("input");
    this.rendered = scope.querySelector(".select3-rendered");
    this.content = scope.querySelector(".select3-content");

    this.open = function () {
        if (this.parentNode.attributes.getNamedItem("disabled")) return;
        content.classList.toggle("show");
        input.focus();
    }

    this.select = function (obj) {
        rendered.innerHTML = obj.innerHTML;
        callback(obj);
        restart();
    }

    this.filter = function () {

        for (var i = 0; i < elems.length; i++) {
            
            if (elems[i].querySelector(".tags") == null || elems[i].querySelector(".tags") == undefined) {
                continue;
            }

            const txtValue = elems[i].querySelector(".tags").textContent || elems[i].querySelector(".tags").innerText;

            if (txtValue.toUpperCase().indexOf(input.value.toUpperCase()) > -1) {
                elems[i].style.display = "";
            } else {
                elems[i].style.display = "none";
            }
        }
    }

    this.restart = function () {
        content.classList.remove("show");

        input.value = "";

        for (var i = 0; i < elems.length; i++) {
            txtValue = elems[i].textContent || elems[i].innerText;
            elems[i].style.display = "";
        }
    }

    this.init = function () {
        this.rendered.addEventListener("click", this.open);
        this.input.addEventListener("keyup", this.filter);
        this.elems.forEach((x) => x.addEventListener("click", () => { this.select(x) }));

        window.addEventListener('click', function (e) {
            if (!scope.contains(e.target)) {
                this.restart();
            }
        });

        const obj = scope.querySelector("li.selected");

        if (obj != undefined) {
            this.select(obj);
        }
    }

    this.init();
}