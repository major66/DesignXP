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

$.event.special.tap.tapholdThreshold = 300;
$.event.special.tap.emitTapOnTaphold = false;
var selectedProductsNb = 0;

var app = {
    initialize: function () {
        this.bindEvents();
    },
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
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
        }
    }
};

function addBorder(event) {
    if (event.currentTarget.classList.contains("selectedItem")) {
        selectedProductsNb--;
        showComparatorButton();
        event.currentTarget.className = "compare-product col-xs-5";
    } else {
        selectedProductsNb++;
        showComparatorButton();
        event.currentTarget.className = "compare-product col-xs-5 selectedItem";
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
            var htmlProducts = '<div class="compare-product col-xs-5">'
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

function generateHtmlRank(rank, role) {
    var i = 0;
    var html = "";
    var starType = role === "user" ? "bigStarBlue" : 'smallStarYellow';
    while (i < rank) {
        html += '<span class="glyphicon glyphicon-star ' + starType + '" aria-hidden="true"></span>\n';
        i++;
    }
    while (i < 5) {
        html += '<span class="glyphicon glyphicon-star-empty ' + starType + '" aria-hidden="true"></span>\n';
        i++;
    }
    return html;
}