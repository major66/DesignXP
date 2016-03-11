/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

$.ajaxSetup({
    async: false
});
Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function (key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

$.event.special.tap.tapholdThreshold = 300;
$.event.special.tap.emitTapOnTaphold = false;
var selectedProductsNb = 0;
var itemsToCompare = [];
var nbHeadphonesSelected = 0;
var isSearchBarOpen = false;

var app = {
    initialize: function () {
        this.bindEvents();
    },
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        $("#compare-button").click(this.saveProducts);
        $("#search-button").click(this.changeButton);
        $("#search-bar").keypress(this.searchProducts);
    },
    onDeviceReady: function () {
        loadProducts();
        var products = document.querySelectorAll(".compare-product");
        for (var i = 0; i < products.length; i++) {
            $(products[i]).bind('taphold', app.startSelector);
        }
        for (var i = 0; i < products.length; i++) {
            $(products[i]).bind('tap', app.onSelectorMode);
        }
    },
    startSelector: function (event) {
        addBorder(event);
    },
    onSelectorMode: function (event) {
        if (selectedProductsNb > 0) {
            addBorder(event);
        } else {
            var productToView = $(event.target).hasClass("compare-product")
                    ? $(event.target).attr("id").split('-')[1]
                    : $(event.target).parents('.compare-product').attr("id").split('-')[1];
            localStorage.setObject('product', productToView);
            window.location = "plug_headphones.html";
        }
    },
    saveProducts: function (event) {
        localStorage.setObject('comparator', JSON.stringify(itemsToCompare));
    },
    changeButton: function (event) {
        if (!isSearchBarOpen) {
            $("#search-bar").show().focus();
            $("#search-button").attr('class', "glyphicon glyphicon-remove");
            isSearchBarOpen = true;
        } else if (isSearchBarOpen) {
            $("#search-bar").val('').hide();
            $("#search-button").attr('class', "glyphicon glyphicon-search");
            isSearchBarOpen = false;
            searchProduct("null");
        }
    },
    searchProducts: function (event) {
        if (event.keyCode === 13 && isSearchBarOpen) {
            event.preventDefault();
            var searchBarValue = $("#search-bar").val();
            searchProduct(searchBarValue);
        }
    }
};
function addBorder(event) {
    if (event.currentTarget.classList.contains("selectedItem")) {
        selectedProductsNb--;
        showComparatorButton();
        event.currentTarget.className = "compare-product col-xs-5";
        updateSelectedItemsToCompare(event, "delete");
    } else {
        selectedProductsNb++;
        showComparatorButton();
        event.currentTarget.className = "compare-product col-xs-5 selectedItem";
        updateSelectedItemsToCompare(event, "add");
    }

}

function updateSelectedItemsToCompare(event, action) {
    var item;
    var nb = document.getElementById("nbHeadphones") ;

    if (action == "add") {
        nbHeadphonesSelected ++;
        nb.innerHTML ="";
        nb.innerHTML = nbHeadphonesSelected;
    }
    else{
        nbHeadphonesSelected --;
        if(nbHeadphonesSelected == "0"){
            nb.innerHTML =" ";
        }
        else{
        nb.innerHTML ="";
        nb.innerHTML = nbHeadphonesSelected;}
    }

    if ($(event.target).hasClass("compare-product")) {
        item = ($(event.target).attr('id').split('-')[1]);
    } else {
        item = ($(event.target).parents('.compare-product').attr('id').split('-')[1]);
    }
    if (action === "add") {
        itemsToCompare.push(item);
    } else {
        itemsToCompare = $.grep(itemsToCompare, function (value) {
            return value !== item;
        });
    }
}

function showComparatorButton() {
    if (selectedProductsNb >= 2) {
        $("#compare-button").show();
    } else {
        $("#compare-button").hide();
    }
}

function loadProducts() {
    $.getJSON("document.json", function (data) {
        $.each(data, function (key, val) {
            var userRank = generateHtmlRank(parseInt(val.user_rank), 'user');
            var proRank = generateHtmlRank(parseInt(val.pro_rank), 'pro');
            var htmlProducts = '<div class="compare-product col-xs-5" id="product-' + val.id + '">'
                    + '<img class="imgIem product-thumbnail" src="' + val.img + '">'
                    + '<h4 class="product-title">' + val.name + '</h4>'
                    + '<div>'
                    + userRank + '</div><div>' + proRank
                    + '<span class="nb-review">(' + val.nb_user_rank + ' avis)</span>'
                    + '</div>'
                    + '<div style="height: 36px;"><p class="priceItem">'
                    + val.price
                    + '</p></div>'
                    + '</div>';
            $("#product-list").append(htmlProducts);
        });
    });
}

function searchProduct(input) {
    if (input === "null") {
        $(".compare-product").each(function (key, val) {
            var productId = $(val).attr('id').split('-')[1];
            $("#product-" + productId).show();
        });
    } else {
        var foundItem = [];
        $.getJSON("document.json", function (data) {
            $.each(data, function (key, val) {
                var lowerCaseString = val.name.toLowerCase();
                if (lowerCaseString.search(input.toLowerCase()) > -1) {
                    foundItem.push(val.id);
                }
            });
        });
        $(".compare-product").each(function (key, val) {
            var productId = $(val).attr('id').split('-')[1];
            if ($.inArray(productId, foundItem) > -1) {
                $("#product-" + productId).show();
            } else {
                $("#product-" + productId).hide();
            }
        });
    }
}

function generateHtmlRank(rank, role) {
    var i = 0;
    var html = "";
    var starType = role === "user" ? "bigStarBlue" : 'smallStarYellow';
    while (i < rank) {
        html += '<span class="glyphicon glyphicon-star ' + starType + '" aria-hidden="true"></span>';
        i++;
    }
    while (i < 5) {
        html += '<span class="glyphicon glyphicon-star-empty ' + starType + '" aria-hidden="true"></span>';
        i++;
    }
    return html;
}