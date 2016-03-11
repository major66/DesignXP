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
//        document.addEventListener('touchmove', function (e) {
//            e.preventDefault();
//        }, false);

        var comparedItems = JSON.parse(localStorage.getObject('comparator'));
        loadProducts(comparedItems);
        var products = document.querySelectorAll(".imgIem");
        for (var i = 0; i < products.length; i++) {
            $(products[i]).bind('tap', app.openView);
        }

        localStorage.setObject('view', "index.html");
        var previousPage = localStorage.getObject('view');
        $(".titleHeader").click(function (event) {
            window.location = previousPage;
        });

        $(".glyphicon-menu-down").click(function (event) {
            $.mobile.silentScroll($(event.target).parents('.compare-product').next().offset().top - 50);
        });
        $(".glyphicon-menu-up").click(function (event) {
            $.mobile.silentScroll($(event.target).parents('.compare-product').prev().offset().top - 50);
        });
    },
    openView: function () {
        var productToView = $(event.target).attr("id").split('-')[1];
        localStorage.setObject('product', productToView);
        localStorage.setObject('view', "compare.html");
        window.location = "plug_headphones.html";
    }
};

function loadProducts(items) {
    $.getJSON("document.json", function (data) {
        $.each(data, function (key, val) {
            if ($.inArray(val.id, items) !== -1) {
                htmlProducts = '<div class="compare-product" style="margin: 0%; border: none; height: 92vh;">'
                        + '<div class="glyphicon glyphicon-menu-up" aria-hidden="true"></div>'
                        + '<img class="imgIem" id="product-' + val.id + '" src="' + val.img + '"/>'
                        + '<div class="glyphicon glyphicon-remove-sign" aria-hidden="true"></div>'
                        + '<div style="margin-top: 5px; letter-spacing: -1px; font-weight: bold;">' + val.name + '</div>'
                        + '<div style="margin-top: 3px; letter-spacing: -1px;">' + val.desc + '</div>'
                        + '<div>' + generateHtmlRank(val.user_rank, "user") + "</div>"
                        + '<div class="specs" style="margin-top: 5px;">' + val.type + '</div>'
                        + '<div class="specs" style="margin-top: 5px;">' + val.hp + '</div>'
                        + '<div class="specs" style="margin-top: 5px;">' + val.wireless + '</div>'
                        + '<div class="specs" style="margin-top: 5px;">' + val.weight + '</div>'
                        + '<div id="expertAdvice" class="leftSide">'
                        + '<div id="audio">' + generateHtmlRank(val.audio, "pro") + "</div>"
                        + '<div id="ergonomie">' + generateHtmlRank(val.ergo, "pro") + "</div>"
                        + '<div id="note">' + generateHtmlRank(val.pro_rank, "pro") + "</div>"
                        + "</div>"
                        + '<div id="price" style="margin-top: 2em; font-size: 2em;">' + val.price + "</div>"
                        + '<div class="glyphicon glyphicon-menu-down" aria-hidden="true"></div></div>';
                $("#first-column").append(htmlProducts);
                $("#second-column").append(htmlProducts);
            }
        });
    });
}

function generateHtmlRank(rank, role) {
    var i = 0;
    var html = "";
    var starType = role === "pro" ? "starExpertBlue" : 'smallStarYellow';
    var starTypeEmpty = role === "pro" ? "glyphicon-star greyStar" : 'glyphicon-star-empty';

    while (i < rank) {
        html += '<span class="glyphicon glyphicon-star ' + starType + '" aria-hidden="true"></span>';
        i++;
    }
    while (i < 5) {
        html += '<span class="glyphicon ' + starType + ' ' + starTypeEmpty + '" aria-hidden="true"></span>';
        i++;
    }
    return html;
}