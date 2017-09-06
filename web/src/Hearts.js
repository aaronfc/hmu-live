import React, { Component } from 'react';
import './Hearts.css';
import $ from 'jquery'

// Hearts component based on http://papermashup.com/periscope-style-heart-effect-with-css-and-js/
// Draft implementation.
class Hearts extends Component {

  _beat() {
    var b = Math.floor((Math.random() * 100) + 1);
    var d = ["flowOne", "flowTwo", "flowThree"];
    var a = ["colOne", "colTwo", "colThree", "colFour", "colFive", "colSix"];
    var c = (Math.random() * (1.6 - 1.2) + 1.2).toFixed(1);
    $('<div class="heart part-' + b + " " + a[Math.floor((Math.random() * 6))] + '" style="font-size:' + Math.floor(Math.random() * (50 - 22) + 22) + 'px;"><i class="fa fa-heart"></i></div>')
    .appendTo(".hearts")
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
      <p>
        <div className="hearts"></div>
      </p>
    );
  }
}

export default Hearts;
