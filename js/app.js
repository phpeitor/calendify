/*
Template: Calendify - Responsive Bootstrap 4 Admin Dashboard Template
Author: iqonicthemes.in
Design and Developed by: iqonicthemes.in
NOTE: This file contains the styling for responsive Template.
*/

/*----------------------------------------------
Index Of Script
------------------------------------------------

:: Tooltip
:: Fixed Nav
:: Ripple Effect
:: Sidebar Widget
:: FullScreen
:: Page Loader
:: Counter
:: Progress Bar
:: Page Menu
:: Close  navbar Toggle
:: user toggle
:: Data tables
:: Form Validation
:: Active Class for Pricing Table
:: Flatpicker
:: Scrollbar
:: checkout
:: Datatables
:: image-upload
:: video
:: Button
:: Pricing tab
:: Wizard Form

------------------------------------------------
Index Of Script
----------------------------------------------*/

(function(jQuery) {



    "use strict";

    jQuery(document).ready(function() {

        /*---------------------------------------------------------------------
        Tooltip
        -----------------------------------------------------------------------*/
        jQuery('[data-toggle="popover"]').popover();
        jQuery('[data-toggle="tooltip"]').tooltip();

        /*---------------------------------------------------------------------
        Fixed Nav
        -----------------------------------------------------------------------*/

        $(window).on('scroll', function () {
            if ($(window).scrollTop() > 0) {
                $('.iq-top-navbar').addClass('fixed');
            } else {
                $('.iq-top-navbar').removeClass('fixed');
            }
        });

        $(window).on('scroll', function () {
            if ($(window).scrollTop() > 0) {
                $('.white-bg-menu').addClass('sticky-menu');
            } else {
                $('.white-bg-menu').removeClass('sticky-menu');
            }
        });

        /*---------------------------------------------------------------------
        Ripple Effect
        -----------------------------------------------------------------------*/
        jQuery(document).on('click', ".iq-waves-effect", function(e) {
            // Remove any old one
            jQuery('.ripple').remove();
            // Setup
            let posX = jQuery(this).offset().left,
                posY = jQuery(this).offset().top,
                buttonWidth = jQuery(this).width(),
                buttonHeight = jQuery(this).height();

            // Add the element
            jQuery(this).prepend("<span class='ripple'></span>");


            // Make it round!
            if (buttonWidth >= buttonHeight) {
                buttonHeight = buttonWidth;
            } else {
                buttonWidth = buttonHeight;
            }

            // Get the center of the element
            let x = e.pageX - posX - buttonWidth / 2;
            let y = e.pageY - posY - buttonHeight / 2;


            // Add the ripples CSS and start the animation
            jQuery(".ripple").css({
                width: buttonWidth,
                height: buttonHeight,
                top: y + 'px',
                left: x + 'px'
            }).addClass("rippleEffect");
        });

       /*---------------------------------------------------------------------
        Sidebar Widget
        -----------------------------------------------------------------------*/

        jQuery(document).on("click", '.iq-menu > li > a', function() {
            jQuery('.iq-menu > li > a').parent().removeClass('active');
            jQuery(this).parent().addClass('active');
        });

        // Active menu
        var parents = jQuery('li.active').parents('.iq-submenu.collapse');

        parents.addClass('show');


        parents.parents('li').addClass('active');
        jQuery('li.active > a[aria-expanded="false"]').attr('aria-expanded', 'true');

        /*---------------------------------------------------------------------
        FullScreen
        -----------------------------------------------------------------------*/
        jQuery(document).on('click', '.iq-full-screen', function() {
            let elem = jQuery(this);
            if (!document.fullscreenElement &&
                !document.mozFullScreenElement && // Mozilla
                !document.webkitFullscreenElement && // Webkit-Browser
                !document.msFullscreenElement) { // MS IE ab version 11

                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
            elem.find('i').toggleClass('ri-fullscreen-line').toggleClass('ri-fullscreen-exit-line');
        });


        /*---------------------------------------------------------------------
        Page Loader
        -----------------------------------------------------------------------*/
        jQuery("#load").fadeOut();
        jQuery("#loading").delay().fadeOut("");


        /*---------------------------------------------------------------------
        Counter
        -----------------------------------------------------------------------*/
        if (window.counterUp !== undefined) {
            const counterUp = window.counterUp["default"]
            const $counters = $(".counter");
            $counters.each(function (ignore, counter) {
                var waypoint = new Waypoint( {
                    element: $(this),
                    handler: function() {
                        counterUp(counter, {
                            duration: 1000,
                            delay: 10
                        });
                        this.destroy();
                    },
                    offset: 'bottom-in-view',
                } );
            });
        }


        /*---------------------------------------------------------------------
        Progress Bar
        -----------------------------------------------------------------------*/
        jQuery('.iq-progress-bar > span').each(function() {
            let progressBar = jQuery(this);
            let width = jQuery(this).data('percent');
            progressBar.css({
                'transition': 'width 2s'
            });

            setTimeout(function() {
                progressBar.appear(function() {
                    progressBar.css('width', width + '%');
                });
            }, 100);
        });

        jQuery('.progress-bar-vertical > span').each(function () {
            let progressBar = jQuery(this);
            let height = jQuery(this).data('percent');
            progressBar.css({
                'transition': 'height 2s'
            });
            setTimeout(function () {
                progressBar.appear(function () {
                    progressBar.css('height', height + '%');
                });
            }, 100);
        });



        /*---------------------------------------------------------------------
        Page Menu
        -----------------------------------------------------------------------*/
        jQuery(document).on('click', '.wrapper-menu', function() {
            jQuery(this).toggleClass('open');
        });

        jQuery(document).on('click', ".wrapper-menu", function() {
            jQuery("body").toggleClass("sidebar-main");
        });


        /*---------------------------------------------------------------------
        user toggle
        -----------------------------------------------------------------------*/
        jQuery(document).on('click', '.iq-user-toggle', function() {
            jQuery(this).parent().addClass('show-data');
        });

        jQuery(document).on('click', ".close-data", function() {
            jQuery('.iq-user-toggle').parent().removeClass('show-data');
        });
        jQuery(document).on("click", function(event){
        var $trigger = jQuery(".iq-user-toggle");
        if($trigger !== event.target && !$trigger.has(event.target).length){
            jQuery(".iq-user-toggle").parent().removeClass('show-data');
        }
        });
        /*-------hide profile when scrolling--------*/
        jQuery(window).scroll(function () {
            let scroll = jQuery(window).scrollTop();
            if (scroll >= 10 && jQuery(".iq-user-toggle").parent().hasClass("show-data")) {
                jQuery(".iq-user-toggle").parent().removeClass("show-data");
            }
        });
        let Scrollbar = window.Scrollbar;
        if (jQuery('.data-scrollbar').length) {

            Scrollbar.init(document.querySelector('.data-scrollbar'), { continuousScrolling: false });
        }



        /*---------------------------------------------------------------------
        Form Validation
        -----------------------------------------------------------------------*/

        // Example starter JavaScript for disabling form submissions if there are invalid fields
        window.addEventListener('load', function() {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function(form) {
                form.addEventListener('submit', function(event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        }, false);

      /*---------------------------------------------------------------------
       Active Class for Pricing Table
       -----------------------------------------------------------------------*/
      jQuery("#my-table tr th").click(function () {
        jQuery('#my-table tr th').children().removeClass('active');
        jQuery(this).children().addClass('active');
        jQuery("#my-table td").each(function () {
          if (jQuery(this).hasClass('active')) {
            jQuery(this).removeClass('active')
          }
        });
        var col = jQuery(this).index();
        jQuery("#my-table tr td:nth-child(" + parseInt(col + 1) + ")").addClass('active');
      });

        /*------------------------------------------------------------------
        Flatpicker
        * -----------------------------------------------------------------*/
      if (jQuery.fn.flatpickr !== undefined) {
          if (jQuery('.basicFlatpickr').length > 0) {
              //jQuery('.basicFlatpickr').flatpickr();
              flatpickr(".basicFlatpickr", {
                //appendTo: document.querySelector(".modal"),
                static: true,
                dateFormat: "Y-m-d",    
                maxDate: new Date().fp_incr(-6570) 
             });
          }

          if (jQuery('#inputTime').length > 0) {
              jQuery('#inputTime').flatpickr({
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
            });
          }
          if (jQuery('#inputDatetime').length > 0) {
              jQuery('#inputDatetime').flatpickr({
                enableTime: true
            });
          }
          if (jQuery('#inputWeek').length > 0) {
              jQuery('#inputWeek').flatpickr({
                weekNumbers: true
            });
          }
          if (jQuery('#inline-date').length > 0) { 
              jQuery("#inline-date").flatpickr({
                inline: true
            });
          }
          if (jQuery('#inline-date1').length > 0) {
              jQuery("#inline-date1").flatpickr({
                inline: true
            });
          }
      }

        /*---------------------------------------------------------------------
        Scrollbar
        -----------------------------------------------------------------------*/

        jQuery(window).on("resize", function () {
            if (jQuery(this).width() <= 1299) {
                jQuery('#salon-scrollbar').addClass('data-scrollbar');
            } else {
                jQuery('#salon-scrollbar').removeClass('data-scrollbar');
            }
        }).trigger('resize');

        jQuery('.data-scrollbar').each(function () {
            var attr = $(this).attr('data-scroll');
            if (typeof attr !== typeof undefined && attr !== false){
            let Scrollbar = window.Scrollbar;
            var a = jQuery(this).data('scroll');
            Scrollbar.init(document.querySelector('div[data-scroll= "' + a + '"]'));
            }
        });


         /*---------------------------------------------------------------------
           Datatables
        -----------------------------------------------------------------------*/
        if(jQuery('.data-tables').length)
        {
          $('.data-tables').DataTable();
        }

        if ($.fn.select2 !== undefined) {
            $("#single").select2({
                placeholder: "Select a Option",
                allowClear: true
            });
            $("#multiple").select2({
                placeholder: "Select a Multiple Option",
                allowClear: true
            });
            $("#multiple2").select2({
                placeholder: "Select a Multiple Option",
                allowClear: true
            });
        }

        /*---------------------------------------------------------------------
        Pricing tab
        -----------------------------------------------------------------------*/
        jQuery(window).on('scroll', function (e) {

            // Pricing Pill Tab
            var nav = jQuery('#pricing-pills-tab');
            if (nav.length) {
                var contentNav = nav.offset().top - window.outerHeight;
                if (jQuery(window).scrollTop() >= (contentNav)) {
                    e.preventDefault();
                    jQuery('#pricing-pills-tab li a').removeClass('active');
                    jQuery('#pricing-pills-tab li a[aria-selected=true]').addClass('active');
                }
            }
        });


        /*---------- */
        $(".dropdown-menu li a").click(function(){
            var selHtml = $(this).html();
            var selName = $.trim($(this).text())
            $(this).parents('.btn-group').find('.search-replace').html(selHtml);
            $(this).parents('.btn-group').find('.search-query').val(selName);
          });

        /*---------------------------------------------------------------------
        List and Grid
        -----------------------------------------------------------------------*/
        $('.list-grid-toggle').click(function() {
            var txt = $(".icon").hasClass('icon-grid') ? 'List' : 'Grid';
            $('.icon').toggleClass('icon-grid');
            $(".label").text(txt);
          })
          
          $('[data-toggle="pill"]').on('click',function () {
              const extra = $(this).attr('data-extra')
              if (extra !== undefined) {
                  $('.tab-extra').removeClass('active')
                  $(extra).addClass('active')
              }
          })

        $('[data-toggle="pill"]').on('click',function () {
            const extra = $(this).attr('data-extras')
            if (extra !== undefined) {
                $('.filter-extra').removeClass('active')
                $(extra).addClass('active')
            }
        })

        $('[data-placement="daterange"]').daterangepicker({
            opens: 'center'
        }, function(start, end, label) {
            console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        });

        $('#view-event').on('click', function(e) {
            e.preventDefault()
            $('#view-btn').tab('show');
        })

        $(document).on('click', '[data-extra-toggle="copy"]', function (e) {
            e.preventDefault()
            $(this).attr("title", "Copied!").tooltip("_fixTitle").tooltip("show").attr("title", "Copy to clipboard").tooltip("_fixTitle");
            const input = $(this).data("input")
            copyToClipboard($(input).val())

        })

        $(document).on('click', '[data-extra-toggle="random-text"]', function (e) {
            e.preventDefault()
            const length = $(this).data('length')
            const input = $(this).data('input')
            const target = $(this).data('target')
            const value = random(length)
            $(input).val(value)
            $(target).html(value)
        })

        const urlParams = new URLSearchParams(window.location.search);
        const activeTab = '#' +urlParams.get('activeTab');
        if ($(activeTab).length > 0) {
            $(activeTab).tab('show')
        }

        function random(length) {
            let result = ''
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            const charactersLength = characters.length
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength))
            }
            return result
        }

        function copyToClipboard(value) {
            const elem = $("<input>")
            $("body").append(elem);
            elem.val(value).select();
            document.execCommand("copy");
            elem.remove();
        }

        $(document).on('change', '.card-change', function (e) {
            $(this).closest('.event-detail').find('.dropdown').addClass('d-none')
            $(this).closest('.event-detail').addClass('disabled')
            $(this).closest('.event-detail').find('.copy').addClass('d-none')
            $(this).closest('.event-detail').find('.turn-on').removeClass('d-none')
            $(this).closest('.event-detail').find('.card-change').prop('checked', true);
        })

        $(document).on('click', '.turn-on', function(e){
            e.preventDefault()
            $(this).closest('.event-detail').find('.copy').removeClass('d-none')
            $(this).closest('.event-detail').find('.card-change').prop('checked', false);
            $(this).closest('.event-detail').removeClass('disabled')
            $(this).closest('.event-detail').find('.dropdown').removeClass('d-none')
            $(this).addClass('d-none')
        })
    });

    var calendar1;

    if (jQuery('#calendar1').length) {
        document.addEventListener('DOMContentLoaded', async function () {
            const calendarEl = document.getElementById('calendar1');
            const $profSel = $('select[name="profesional"]');
            const $horaSel = $('select[name="horario"]');

            let eventsData = [];
            let dayEventsCache = [];

            // ------- carga JSON -------
            try {
                const res = await fetch('./js/programacion.json', { cache: 'no-store' });
                const json = await res.json();
                eventsData = (json.events || []).map(e => {
                    const out = { ...e };
                    if (!out.title && out.profesional) out.title = out.profesional;
                    return out;
                });
            } catch (err) {
                console.error('No se pudo cargar events.json', err);
            }

            // ------- helpers para selects -------
            function refreshPicker($el){ if ($el.selectpicker) $el.selectpicker('refresh'); }

            function resetProfesionales() {
                $profSel.empty().append('<option value="">Seleccione profesional..</option>');
                refreshPicker($profSel);
            }

            function resetHorarios() {
                $horaSel.empty().append('<option value="">Seleccione horario..</option>');
                refreshPicker($horaSel);
            }

            function formatHM(iso) { return iso.substring(11,16); }

            const BLOCK_COLOR = '#ffc107';
            const APPT_STEP_MIN = 45;

            function pad2(n){ return String(n).padStart(2,'0'); }
            function minutesFromISO(iso){ const [H,M] = iso.slice(11,16).split(':').map(Number); return H*60 + M; }
            function hmFromMinutes(m){ const h = Math.floor(m/60), mm = m%60; return `${pad2(h)}:${pad2(mm)}`; }

            function makeSlotsAligned(startISO, endISO, step=APPT_STEP_MIN){
                const s = minutesFromISO(startISO), e = minutesFromISO(endISO);
                if (e <= s) return [];
                const offset = (e - s) % step;        
                const first  = s + offset;
                const out = [];
                for (let t = first; t <= e; t += step) out.push(hmFromMinutes(t));
                return out;
            }

            function fillHorarioSlotsForProfessional(pro){
                resetHorarios();
                if (!pro) return;

                const ranges = dayEventsCache
                    .filter(e => e.profesional === pro)
                    .sort((a,b) => a.start.localeCompare(b.start));

                const used = new Set();
                ranges.forEach(r => {
                    const day = r.start.slice(0,10);
                    const slots = makeSlotsAligned(r.start, r.end, 45);
                    slots.forEach(hhmm => {
                    const startISO = `${day}T${hhmm}:00`;
                    const endMin   = minutesFromISO(startISO) + 45;
                    const endISO   = `${day}T${hmFromMinutes(endMin)}:00`;
                    const value    = `${startISO}|${endISO}`;      
                    if (!used.has(value)) {
                        $horaSel.append(`<option value="${value}">${hhmm}</option>`);
                        used.add(value);
                    }
                    });
                });

                refreshPicker($horaSel);
            }

            function eventCoversDay(e, dateStr) {
                const start = (e.start || '').slice(0, 10);
                if (!start) return false;

                if (e.allDay) {
                    const end = e.end ? e.end.slice(0,10) : start;   
                    return e.end ? (dateStr >= start && dateStr < end) : (dateStr === start);
                }
                return dateStr === start;
            }

            function isBlockedDay(dateStr) {
                return eventsData.some(e =>
                    (e.color || '').toLowerCase() === BLOCK_COLOR &&
                    eventCoversDay(e, dateStr)
                );
            }

            function isPastDay(dateStr) {
                const todayStr = new Date().toISOString().slice(0,10); 
                return dateStr < todayStr;
            }

            function showAlert(msg) {
                let $c = $('#calendar-alert');
                if (!$c.length) $c = $('<div id="calendar-alert" class="mt-2"></div>').insertBefore('#calendar1');

                $c.html(`
                    <div class="alert text-white bg-danger fade show" role="alert">
                    <div class="iq-alert-icon"><i class="ri-information-line"></i></div>
                    <div class="iq-alert-text">${msg}</div>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <i class="ri-close-line"></i>
                    </button>
                    </div>
                `);

                setTimeout(() => { $c.find('.alert').alert('close'); }, 4000);
            }

            function populateSelectsForDate(day){
                resetProfesionales(); 
                resetHorarios();

                if (!day) return;
                if (isBlockedDay(day)) { showAlert('Este día está bloqueado'); return; }
                if (isPastDay(day)) { showAlert('No puedes seleccionar un día pasado'); return; }

                dayEventsCache = eventsData.filter(e => !e.allDay && e.start.slice(0,10) === day);

                if (dayEventsCache.length === 0){
                    showAlert('No hay eventos para este día');
                    return;
                }

                const vistos = new Set();
                dayEventsCache.forEach(e=>{
                    if (e.profesional && !vistos.has(e.profesional)){
                        $profSel.append(`<option value="${e.profesional}">${e.profesional}</option>`);
                        vistos.add(e.profesional);
                    }
                });
                refreshPicker($profSel);
            }

            $('#fecha_cita').on('change', function(){
                const day = this.value.slice(0,10); 
                populateSelectsForDate(day);
            });


            // ------- inicializa calendario -------
            const calendar1 = new FullCalendar.Calendar(calendarEl, {
                selectable: true,
                plugins: ["timeGrid", "dayGrid", "list", "interaction"],
                timeZone: "UTC",
                defaultView: "dayGridMonth",
                contentHeight: "auto",
                eventLimit: true,
                dayMaxEvents: 4,
                header: { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek" },
                dateClick: function (info) {
                    const day = info.dateStr.slice(0,10);
                    if (isBlockedDay(day)) return;
                    if (isPastDay(day)) return;

                    dayEventsCache = eventsData.filter(e => !e.allDay && e.start.slice(0,10) === day);

                    if (dayEventsCache.length === 0) {
                        showAlert('Sin programación para el día: '+ day);
                        return;
                    }

                    $('#fecha_cita').val(day);
                    resetProfesionales(); resetHorarios();
                    const vistos = new Set();
                    dayEventsCache.forEach(e => {
                        if (e.profesional && !vistos.has(e.profesional)) {
                            $profSel.append(`<option value="${e.profesional}">${e.profesional}</option>`);
                            vistos.add(e.profesional);
                        }
                    });
                    
                    if ($('.selectpicker').length) $('.selectpicker').selectpicker('refresh');

                    $('#date-event').modal('show');
                },
                events: eventsData
            });

            calendar1.render();

            $('[name="profesional"]').off('change.gen45').on('change.gen45', function(){
                const pro = $(this).val();
                fillHorarioSlotsForProfessional(pro);
            });

            $('[name="horario"]').off('change.keep').on('change.keep', function(){
                const val = $(this).val(); 
            });

            $(document).on("submit", "#submit-schedule", function (e) {
                e.preventDefault();
                const title = $(this).find('#schedule-title').val();
                
                
            });
        });
    }

    $('[data-toggle="tooltip"]').tooltip();
    // quill
    if (jQuery("#editor").length) {
        new Quill('#editor', {theme: 'snow'});
    }
    // With Tooltip
    if (jQuery("#quill-toolbar").length) {
        new Quill('#quill-toolbar', { modules: { toolbar: '#quill-tool' }, placeholder: 'Compose an epic...', theme: 'snow' });
        // Can control programmatically too
        $('.ql-italic').mouseover();
        setTimeout(function() {
            $('.ql-italic').mouseout();
        }, 2500);
    }

    const readURL = function(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                $('.profile-pic').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }


    $(".file-upload").on('change', function(){
        readURL(this);
    });

    $(".upload-button").on('click', function() {
       $(".file-upload").trigger('click');
    });

    /*-------------------------------------------------
                    Wizard Form
    ------------------------------------------------*/
    const wizardElem = document.getElementsByClassName('form-wizard')
    Array.from(wizardElem, (elem) => {
        const nextBtn = elem.querySelectorAll('.next')
        const prevBtn = elem.querySelectorAll('.previous')
        const tabs = elem.querySelector('.tab-items')
        if (tabs !== undefined && tabs !== null) {
            const items = tabs.querySelectorAll('li')
            Array.from(items, (item) => {
                item.addEventListener('click', () => {
                    console.log('test')
                })
            })
        }
        if (nextBtn !== undefined && nextBtn !== null) {
            Array.from(nextBtn, (btn) => {
                btn.addEventListener('click', (elemNext) => {
                    const currentPan = btn.closest('fieldset')
                    currentPan.classList.remove('active')
                    currentPan.style.display = 'none'
                    currentPan.nextElementSibling.style.display = 'block'
                    currentPan.nextElementSibling.classList.add('active')
                })
            })
        }
        if (prevBtn !== undefined && prevBtn !== null) {
            Array.from(prevBtn, (btn) => {
                btn.addEventListener('click', (elemNext) => {
                    const currentPan = btn.closest('fieldset')
                    currentPan.classList.remove('active')
                    currentPan.style.display = 'none'
                    currentPan.previousElementSibling.style.display = 'block'
                    currentPan.previousElementSibling.classList.add('active')
                })
            })
        }
    })
})(jQuery);
