function Label(opt_options) {
    this.setValues(opt_options);
    var div = this.div_ = document.createElement('div');
    div.style.cssText = 'position: absolute; display: none;';
};

var touchProgress = 0;

Label.prototype = new google.maps.OverlayView;

Label.prototype.onAdd = function () {
    var pane = this.getPanes().overlayImage;
    pane.appendChild(this.div_);

    // Ensures the label is redrawn if the text or position is changed.
    var me = this;
    this.listeners_ = [
          google.maps.event.addListener(this, 'position_changed',
               function () { me.draw(); }),
          google.maps.event.addListener(this, 'text_changed',
               function () { me.draw(); }),
          google.maps.event.addListener(this, 'zindex_changed',
               function () { me.draw(); })
    ];

    //add element to clickable layer 
    this.getPanes().overlayMouseTarget.appendChild(this.div_);

    // set this as locally scoped var so event does not get confused
    var me = this;

    // Add a listener - we'll accept clicks anywhere on this div, but you may want
    // to validate the click i.e. verify it occurred in some portion of your overlay.
    if (appType != "ios") {
        google.maps.event.addDomListener(this.div_, 'click', function () {
            google.maps.event.trigger(me, 'click');
        });
    }
    else {
        this.div_.addEventListener("touchstart", function () {
            touchProgress = 1;
        });
        this.div_.addEventListener("touchmove", function () {
            touchProgress = 2;
        });
        this.div_.addEventListener("touchend", function () {
            if (me.getMap().disableDefaultUI == false && touchProgress == 1) {
                google.maps.event.trigger(me, 'click');
            }
        });
    }
};

// Implement onRemove
Label.prototype.onRemove = function () {
    if (typeof this.div_.parentNode != "undefined") {
        this.div_.parentNode.removeChild(this.div_);
    }

    // Label is removed from the map, stop updating its position/text.
    for (var i = 0, I = this.listeners_.length; i < I; ++i) {
        google.maps.event.removeListener(this.listeners_[i]);
    }
};

// Implement draw
Label.prototype.draw = function () {
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.get('position'));
    if (position != null) {
        var div = this.div_;
        div.style.left = position.x + 'px';
        div.style.top = position.y + 'px';
        if (this.get('visible') == null || this.get('visible') == undefined || this.get('visible') == true)
            div.style.display = 'block';
        else
            div.style.display = 'none';
        if (this.get('zIndex') != null && this.get('zIndex') != undefined)
            div.style.zIndex = this.get('zIndex'); //ALLOW LABEL TO OVERLAY MARKER
        if (this.get('opacity') != null && this.get('opacity') != undefined)
            div.style.opacity = this.get('opacity');
        if (this.get('className') != null && this.get('className') != undefined)
            div.className = this.get('className');
        if (this.get('id') != null && this.get('id') != undefined)
            div.id = this.get('id');

        if (this.get('text') != undefined)
            div.innerHTML = this.get('text').toString();
        if (this.get('title') != undefined)
            div.title = this.get('title').toString();

        var divObj = $(div);

        div.style.left = position.x - parseInt(divObj.css('width').replace('px', '')) + 'px';
        div.style.top = position.y - parseInt(divObj.css('height').replace('px', '')) + 'px';
    }
};

Label.prototype.getPosition = function () {
    return this.get('position');
};
