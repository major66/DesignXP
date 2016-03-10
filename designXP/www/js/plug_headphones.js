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
        var product = JSON.parse(localStorage.getObject('product'));
        loadProduct(product);
    }
};

function loadProduct(items) {
    $.getJSON("document.json", function (data) {
        $.each(data, function (key, val) {
            if (val.id == items) {
                console.log(val);
                var htmlProducts = '<div class="compare-product" style="margin: 0%; border: none;  height: 92vh;">'
                        + "<img class='imgIIem' src='" + val.img + "'/>"
                        + '<div style="margin-top: 5px; font-weight: bold;" title="name">' + val.name + '</div>'
                        + '<div style="margin-top: 3px;" title="desc">' + val.desc + '</div>'
                        + '<br>Note global'
                        + '<div title="global">' + generateHtmlRank(val.pro_rank, "pro") + "</div>"
                        + "<br>Ergonomie"
                        + "<div title='global'>" + generateHtmlRank(val.ergo, "pro") + "</div>"
                        + "<br>Audio"
                        + "<div title='global'>" + generateHtmlRank(val.audio, "pro") + "</div><br>"
                        + "<div style='margin-top: 5px;' title='type'><span>Type de casque : </span><span>" + val.type + "</span></div>"
                        + "<div style='margin-top: 5px;' title='speaker'><span>Haut parleur : </span><span>" + val.hp + "</span></div>"
                        + "<div style='margin-top: 5px;' title='noise_reducer'><span>Reducteur de bruit : </span><span>" + val.noise_reducer + "</span></div>"
                        + "<div style='margin-top: 5px;' title='wireless'><span>Wifi : </span><span>" + val.wireless + "</span></div>"
                        + "<div style='margin-top: 5px;' title='price'>" + val.price + "</div>"
                        + '<div title="button_purchase">'
                        + '<a href="#" onclick="window.open("' + val.link + '", "_system");"><img src="img/achat.jpg" height="44"></a>'
                        + "</div></div>";
                $("#first-column").append(htmlProducts);
            }
        });
    });
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