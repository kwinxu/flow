/**
 *@author xyx   <kwin.xu@semioe.com>
 *        date: 2016.12.30
 *@description 
 */
/* jshint ignore: start */
'use strict';
/* jshint ignore: end   */

function getFlow(id) {   // jshint ignore:line
    window.location.href = '/flow_page/?id=' + id;
}


function _delete(id) {    // jshint ignore:line
    $.ajax({
        url: '/flow/' + id,
        type: 'DELETE',
        dataType: 'JSON',
        success: function (result) {
            result = JSON.parse(result);
            if (result.error_code === 0) {
                alert('删除成功！');
            } else {
                alert('删除失败！');
            }
            window.location.href = '/';
        }
    });
}

window.onload = function () {
    $('#add').click(function () {
        var name = prompt('请输入名称：');
        if (name) {
            createFlow(name);
        } else {
            alert('请输入名称！');
        }
    });
}


function createFlow(name) {     // jshint ignore:line
    $.ajax({
        url: '/flow',
        type: 'POST',
        dataType: 'JSON',
        success: function (result) {    // jshint ignore:line
            window.location.href = '/';
        }
    });
}