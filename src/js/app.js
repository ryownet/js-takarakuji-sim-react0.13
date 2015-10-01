
(function(w){
  "use strict";

  var $ = w.jQuery;
  var d = w.document;
  var kujiUtil = require('./_kujiUtil');
  var judge = require('./_judge');
  var React = require('react');



// React Class
  var ViewUserSpendMoneyArea = React.createClass({
    render: function () {
      return (
        <div>
         <span className="disp-total">{model.totalSpendMoney.toLocaleString()}</span>
          <span className="unit">円</span>
        </div>
      );
    }
  });
  var ViewUserTotalGetMoneyArea = React.createClass({
    render: function () {
      return (
        <div>
          <span className="disp-kakutoku">{model.totalGetMoney.toLocaleString()}</span>
          <span className="unit">円</span>
        </div>
      );
    }
  });
  var ShusiViewSagakuArea = React.createClass({
    render: function () {
      return (
        <div>
          <span className={model.sagaku>0 ? '': 'is-minus'}>{model.sagaku.toLocaleString()}</span>
        </div>
      );
    }
  });
  var ShusiViewTotalMaisuuArea = React.createClass({
    render: function () {
      return (
        <div className="maisuu">
          <span>{model.totalKujiCount.toLocaleString()}</span>
          <span className="unit">枚</span>
        </div>
      );
    }
  });
  var RepeatKujiListArea = React.createClass({
    render : function () {
      return (
        <div>
        {
          this.props.list.map( function (item) {
            return (
            <div className="koma clearfix">
              <div className="ttl-atari">
                {item.name}
                <span className="kingaku">{item.kingaku}
                 <span className="unit">円</span>
                </span>
              </div>
              <div className="mai">
                × <span>{item.atariCount}</span>
              </div>
            </div>
            )
          })
        }
        </div>
      );
    }
  });


  var ActionBarArea = React.createClass({
    isStop: function () {
      return model.isStop ? '': 'disabled';
    },
    isStart: function () {
      return !model.isStop ? '': 'disabled';
    },
    onStart: function () {
      model.isStop = false;
      kujiUtil.intervalID = setInterval( this.getKuji, kujiUtil.INTERVAL );
      React.render(
        <ActionBarArea />,
        d.getElementById('jsx-actionBarArea')
      );
    },
    onStop: function () {
      model.isStop = true;
      clearInterval( kujiUtil.intervalID );
      React.render(
        <ActionBarArea />,
        d.getElementById('jsx-actionBarArea')
      );
    },
    getKuji : function (){
      var k = new kujiUtil.Kuji();
      var j = judge(k, kujiUtil);
      this
        .setJudgeResult(j)
        .renderResult();
    },
    setJudgeResult: function (j) {
      if( j.name ){
        model.totalGetMoney += j.kingaku;
        model.dispItems.forEach(function(item){
          if (item.category === j.category){
            item.atariCount++;
          }
        });
      }
      model.totalKujiCount++;
      model.totalSpendMoney += kujiUtil.TANKA;
      model.sagaku = model.totalGetMoney - model.totalSpendMoney;
      return this;
    },
    renderResult: function () {
      React.render(
        <ViewUserSpendMoneyArea />,
        d.getElementById('jsx-viewUserSpendMoneyArea')
      );
      React.render(
        <ViewUserTotalGetMoneyArea />,
        d.getElementById('jsx-viewUserTotalGetMoneyArea')
      );
      React.render(
        <ShusiViewSagakuArea />,
        d.getElementById('jsx-shusiViewSagakuArea')
      );
      React.render(
        <ShusiViewTotalMaisuuArea />,
        d.getElementById('jsx-shusiViewTotalMaisuuArea')
      );
      React.render(
        <RepeatKujiListArea list={model.dispItems} />,
        d.getElementById('jsx-repeatKujiListArea')
      );
    },
    render: function () {
      return (
        <div className="actionBar" id="actionBar"><div className="inner">
          <button className="btn btn-primary" onClick={this.onStart} disabled={this.isStop()}>スタート</button>
          <button className="btn btn-stop" onClick={this.onStop} disabled={this.isStart()}>一時停止</button>
        </div></div>
      );
    }
  })




/*
  くじ結果データ管理のviewModel
 */
var model = {
  totalSpendMoney: 0,
  totalGetMoney: 0,
  totalKujiCount: 0,
  sagaku: 0,
  isStop: true,
  dispItems: []
};






$(document).ready(function (){
  $.getJSON('setting/data.json', function (data){
    kujiUtil.atariArr = data;

    var l = kujiUtil.atariArr.length;
    var category = '';
    var items = [];
    for(var i=0; i< l; i++){
      if(kujiUtil.atariArr[i].category === category) continue;
      category = kujiUtil.atariArr[i].category;
      var atariVmData = {
        name: kujiUtil.atariArr[i].name,
        kingaku: kujiUtil.atariArr[i].kingaku,
        category: kujiUtil.atariArr[i].category,
        atariCount: 0
      };
      model.dispItems.push( atariVmData );
    }
    React.render(
      <ActionBarArea />,
      d.getElementById('jsx-actionBarArea')
    );
    React.render(
      <ViewUserSpendMoneyArea />,
      d.getElementById('jsx-viewUserSpendMoneyArea')
    );
    React.render(
      <ViewUserTotalGetMoneyArea />,
      d.getElementById('jsx-viewUserTotalGetMoneyArea')
    );
    React.render(
      <ShusiViewSagakuArea />,
      d.getElementById('jsx-shusiViewSagakuArea')
    );
    React.render(
      <ShusiViewTotalMaisuuArea />,
      d.getElementById('jsx-shusiViewTotalMaisuuArea')
    );
    React.render(
      <RepeatKujiListArea list={model.dispItems} />,
      d.getElementById('jsx-repeatKujiListArea')
    );
  })
});




})(window);
