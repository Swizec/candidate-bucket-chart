
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin;



var Icon = React.createClass({
    mixins: [PureRenderMixin],

    sizes: {
        male: [12, 32],
        female: [19, 32],
        none: [12, 32]
    },

    man_icon: function () {
        return (
            <g>
                <path d="M18 3c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-1.657 1.343-3 3-3s3 1.343 3 3z"></path>
                <path d="M18 8h-6c-1.105 0-2 0.895-2 2v10h2v12h2.5v-12h1v12h2.5v-12h2v-10c0-1.105-0.895-2-2-2z"></path>
            </g>
        );
    },

    woman_icon: function () {
        return (
            <g>
                <path d="M18 3c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-1.657 1.343-3 3-3s3 1.343 3 3z"></path>
                <path d="M22.469 16l1.531-1.109-4.165-6.441c-0.185-0.281-0.499-0.45-0.835-0.45h-8c-0.336 0-0.65 0.169-0.835 0.45l-4.165 6.441 1.531 1.109 3.458-4.487 1.202 2.804-4.191 7.683h3.833l0.667 10h2v-10h1v10h2l0.667-10h3.833l-4.191-7.683 1.202-2.804 3.458 4.487z"></path>
            </g>
        );
    },

    none_icon: function () {
        return this.man_icon();
    },

    componentWillMount: function () {
        this.__tellDimensions(this.props);
    },

    componentWillReceiveProps: function (nextProps) {
        this.__tellDimensions(nextProps);
    },

    __tellDimensions: function (props) {
        props.tellDimensions(this.sizes[props.gender][0]*props.r,
                             this.sizes[props.gender][1]*props.r);
    },

    render: function () {
        var size = this.sizes[this.props.gender],
            transform = "scale("+this.props.r+") translate("+(this.props.cx-size[0]*this.props.r/2)+", "+(this.props.cy-size[1]*this.props.r/2)+")";

        var icons = {
            male: this.man_icon,
            female: this.woman_icon,
            none: this.none_icon
        };

        return (
            <g transform={transform}>
                {icons[this.props.gender]()}
            </g>
        );
    }
});

module.exports = Icon;
