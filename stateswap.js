/*
  State Swap plugin for jQuery
  Copyright (c) 2012 Brian Voelker (webiswhatido.com)
  Licensed under GPLv3
  http://www.opensource.org/licenses/gpl-3.0.html
  Version: 1
*/

(function($){

	/* Select Options */
    var select_options = {
        /* General options */
        placeholder: false,
        abbreviation: true,
        lowercase: false, /* lower only on abbreviated states */
        /* State options */
        state_id: false,
        state_val: false,
        /* Event options */
        on_create: null,
        on_update: null
    };

    /* Select Data */
    var select_data = {
        init_setup: true,
        country_select: null, /* Country select */
        country_value: false, /* Country value */
        state_select: null
    };

    var state_swap_funcs = {
        /************************/
        /*** Public functions ***/
        /************************/
        create: function(options, input) {
            var info = this;
            
            /* Replace default options with requested options */
            info.options = $.extend({}, select_options, options);
            info.data = $.extend({}, select_data, {});
            
            /* Set select and get currently selected country */
            info.data.country_select = $(input);
            info.data.country_value = (info.data.country_select.val()).toLowerCase();
            info.data.state_select = $('#'+info.options.state_id);

            /* Intiate country */
            info._set_country();

            /* Add on change event to country dropdown */
            info.data.country_select.change(function(){
                info.data.country_value = this.value;
                info._set_country();
            });

            /* Trigger on_create */
            info.options.on_create.apply();
        },
        /*************************/
        /*** Private functions ***/
        /*************************/
        _set_country: function(){
            var info = this;

            /* Set state options */
            if(info.data.country_value == 'us' || info.data.country_value == 'united states'){
                /* United States */
                info._set_united_states();
            } else if(info.data.country_value == 'ca' || info.data.country_value == 'canada'){
                /* Canada */
                info._set_canada();
            }
        },
        _add_options: function(states) {
            var info = this;
            var options = '';

            $.each(states, function(key, value) {
                value = (info.options.abbreviation ? (info.options.lowercase ? key.toLowerCase(): key.toUpperCase()): value);
                options += '<option value="'+value+'">'+value+'</option>';
            });
            info.data.state_select.html(options);

            if(info.options.state_val){
                console.log(info.options.state_val);
                info.data.state_select.val(info.options.state_val);
            }

            /* Trigger on_update */
            if(info.data.init_setup){
                info.data.init_setup = false;
            } else {
                info.options.on_update();
            }
        },
        /*************************/
        /*** Setting Countries ***/
        /*************************/
        _set_united_states: function() {
            var info = this;
            var states = {
                'AL':'Alabama', 'AK':'Alaska', 'AZ':'Arizona', 'AR':'Arkansas', 'CA':'California', 'CO':'Colorado', 'CT':'Connecticut', 'DE':'Delaware',  
                'DC':'District Of Columbia', 'FL':'Florida', 'GA':'Georgia', 'HI':'Hawaii', 'ID':'Idaho', 'IL':'Illinois', 'IN':'Indiana', 'IA':'Iowa',  
                'KS':'Kansas', 'KY':'Kentucky', 'LA':'Louisiana', 'ME':'Maine', 'MD':'Maryland', 'MA':'Massachusetts', 'MI':'Michigan', 'MN':'Minnesota',  
                'MS':'Mississippi', 'MO':'Missouri', 'MT':'Montana', 'NE':'Nebraska', 'NV':'Nevada', 'NH':'New Hampshire', 'NJ':'New Jersey', 'NM':'New Mexico',
                'NY':'New York', 'NC':'North Carolina', 'ND':'North Dakota', 'OH':'Ohio', 'OK':'Oklahoma', 'OR':'Oregon', 'PA':'Pennsylvania', 'RI':'Rhode Island',  
                'SC':'South Carolina', 'SD':'South Dakota', 'TN':'Tennessee', 'TX':'Texas', 'UT':'Utah', 'VT':'Vermont', 'VA':'Virginia', 'WA':'Washington',  
                'WV':'West Virginia', 'WI':'Wisconsin', 'WY':'Wyoming'
            };
            info._add_options(states);
        },
        _set_canada: function() {
            var info = this;
            var provinces = {
                'AB':'Alberta', 'BC':'British Columbia', 'MB':'Manitoba', 'NB':'New Brunswick', 'NF':'Newfoundland and Labrador', 'NT':'Northwest Territories',
                'NS':'Nova Scotia', 'NU':'Nunavut', 'ON':'Ontario', 'PE':'Prince Edward Island', 'QC':'Quebec', 'SK':'Saskatchewan', 'YT':'Yukon Territory'
            };
            info._add_options(provinces);
        }
    };

	$.fn.stateswap = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            /* Only allow select dropdown */
            if($(this).is('select')) {
                /* Method calling logic */
                if (state_swap_funcs[options]) {
                    if($(this).data('stateswap')) {
                        state_swap_funcs[options].apply(this, args);
                    }
                } else if (typeof options === 'object' || !options) {
                    if(!$(this).data('stateswap')){
                    		var state_swap_obj = Object.create(state_swap_funcs);
	                        state_swap_obj.create(options, this);
	                        $.data(this, 'stateswap', state_swap_obj);
                    }   
                } else {
                    $.error('Method ' +  options + ' does not exist in State Swap');
                }
            } else {
                $.error('State Swap can only be applied to select dropdowns.');
            }
        });
    };
})(jQuery);

/* IE 8, 7 Compatibility */
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}