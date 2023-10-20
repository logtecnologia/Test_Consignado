var maxHeight = 600;

$(function() {

    $(".menu > li").hover(function() {

        var $container = $(this),
            $list = $container.find("ul"),
            $anchor = $container.find("a"),
            height = $list.height() * 1.1, // certifique-se de que há espaço suficiente na parte inferior 
            multiplier = height / maxHeight; // precisa se mover mais rápido se a lista for mais alta 

        // precisa salvar a altura aqui para que possa reverter no mouseout             
        $container.data("origHeight", $container.height());

        // para que ele possa manter sua cor de rollover enquanto a lista suspensa estiver aberta 
        $anchor.addClass("hover");

        // certifique-se de que a lista suspensa apareça diretamente abaixo do item da lista pai     
        $list
            .show()
            .css({
                paddingTop: $container.data("origHeight")
            });

        // não faça nenhuma animação se a lista for menor que max 
        if (multiplier > 1) {
            $container
                .css({
                    height: maxHeight,
                    overflow: "hidden"
                })
                .mousemove(function(e) {
                    var offset = $container.offset();
                    var relativeY = ((e.pageY - offset.top) * multiplier) - ($container.data("origHeight") * multiplier);
                    if (relativeY > $container.data("origHeight")) {
                        $list.css("top", -relativeY + $container.data("origHeight"));
                    };
                });
        }

    }, function() {

        var $el = $(this);

        // colocar as coisas de volta ao normal
        $el
            .height($(this).data("origHeight"))
            .find("ul")
            .css({
                top: 0
            })
            .hide()
            .end()
            .find("a")
            .removeClass("hover");

    });

    // Adicionar seta para baixo apenas para itens de menu com submenus
    $(".menu > li:has('ul')").each(function() {
        $(this).find("a:first").append("<img src='img/down-arrow.png' />");
    });


});