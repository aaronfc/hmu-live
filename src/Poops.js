import React, { Component } from 'react';
import './Poops.css';
import $ from 'jquery'

class Poops extends Component {

  _beat() {
    var b = Math.floor((Math.random() * 100) + 1);
    var d = ["poopFlowOne", "poopFlowTwo", "poopFlowThree"];
    var c = (Math.random() * (1.6 - 1.2) + 1.2).toFixed(1);
    var size = Math.floor(Math.random() * (50 - 22) + 22);
    $('<div class="poop part-' + b + '" style="width:' + size + 'px;height:' + size + 'px;"></div>')
    .appendTo(".poops")
    .css({animation: "" + d[Math.floor((Math.random() * 3))] + " " + c + "s linear"});
    $(".part-" + b).show();
    setTimeout(function() {$(".part-" + b).remove()}, c * 900);
  }

  _draw(numHearts) {
    for (var i=0; i<numHearts; i++) {
      // Spread over 1.2 seconds to add flowness (matching polling time of 1s)
      setTimeout(this._beat, Math.floor((Math.random() * 1200) + 1));
    }
  }

  render() {
    return (
      <div>
        <div className="poops"></div>
      </div>
    );
  }
}

export default Poops;
