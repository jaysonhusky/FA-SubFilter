// ==UserScript==
// @name         SubFilter
// @namespace    FurAffinity.net
// @version      0.2.5
// @description  Enable/Disable YCH and Stream notifications
// @author       JaysonHusky
// @match        *://www.furaffinity.net/*
// @exclude      *://www.furaffinity.net/login/
// @exclude      *://www.furaffinity.net/logout/
// @exclude      *://www.furaffinity.net/controls/submissions/
// @exclude      *://www.furaffinity.net/controls/settings/
// @grant       GM_getValue
// @grant       GM_setValue
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==
(function() {
    'use strict';
    var TemplateStyle=$('body').attr('data-static-path');
    var YCHSHidden=0;var StreamsHidden=0;
    console.log("Stream Setting: "+GM_getValue('stream_control')+ " ||| YCH Setting: "+GM_getValue('ych_control'));
    // Add Special Stylesheet for keywords
		var JaysCSS=document.createElement('style');
		var jayStyle=document.createTextNode(`
			#customfacontrolpanel{
				margin-top:20px;
			}
			.JaySB{
				background: #36393d;
				padding: 7px 14px 14px 14px;
			}
			#speciallisting li{
				margin-left:20px;
			}
		`);
		JaysCSS.appendChild(jayStyle);
		document.getElementsByTagName('body')[0].appendChild(JaysCSS);
    // Adapt JQuery :contains to function without case restriction
    jQuery.expr[':'].icontains=function(a, i, m){
		return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
	};
    // JS equiv of PHPs ucwords() for better presentation (Credit: rickycheers @ Github)
    String.prototype.ucwords=function(){
        strtouc=this.toLowerCase();
        return strtouc.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,function(s){
            return s.toUpperCase();
        });
    };
    // Load Current Settings
    function SF_LoadCP(i){
        var setting_returned = GM_getValue(i);
        if(setting_returned=="yes"){
          if(i=="stream_control"){
              $("select#streamid").val("yes");
          }
            else {
                $("select#ychid").val("yes");
            }
        }
        else if(setting_returned=="no") {
             if(i=="stream_control"){
              $("select#streamid").val("no");
          }
            else {
                $("select#ychid").val("no");
            }
        }
        else {
             console.log('[DEBUG]: Setting: '+i+' Returned: '+setting_returned+' (Result not valid, or control not set)');
             $("select#ychid").val("unset"); $("select#streamid").val("unset");
        }
    }
    function SF_Load_Tweaks(i){
        var setting_returned = GM_getValue(i);
        if(setting_returned=="yes"){
            return "yes";
        }
        else if(setting_returned=="no") {
             return "no";
        }
        else {
             return "undefined";
        }
    }
    function SF_SaveSettings(ych,stream){
        GM_setValue('ych_control',ych);GM_setValue('stream_control',stream);
    }
	function ExecuteTweak(tweak){
		switch(tweak) {
			case "noYCH":
                //Browse Page
                $("section figure figcaption").find("p:first a:icontains('ych')").parent().parent().parent().parent().css('display','none');
                // Submission Inbox Page
                $("#messagecenter-submissions section figure figcaption").find("label p:first a:icontains('ych')").parent().parent().parent().parent().css('display','none');
                YCHSHidden=YCHSHidden+1;
			break;
			case "noSTREAM":
                //Browse Page
                $("section figure figcaption").find("p:first a:icontains('stream')").parent().parent().parent().parent().css('display','none');
                // Submission Inbox Page
                $("#messagecenter-submissions section figure figcaption").find("label p:first a:icontains('stream')").parent().parent().parent().parent().css('display','none');
                StreamsHidden=StreamsHidden+1;
			break;
			default:
			/* No Code */
		}
	}
     var pathx = window.location.pathname;
        if(~pathx.indexOf("/controls/user-settings/")){
    // Update
	$(document.body).on('click', '#sf_saveit', function() {
		var sf_set_ych=$("select#ychid option:checked").val();var sf_set_stream=$("select#streamid option:checked").val();
		SF_SaveSettings(sf_set_ych,sf_set_stream);
		$('.sf-update-status_x').fadeIn('slow');
			setTimeout(function(){
				$('.sf-update-status_x').fadeOut('slow');
			}, 5000);
		});
		if(TemplateStyle=="/themes/beta"){
            $('.content .section-body').after(`
		<div id="customfacontrolpanel" class="JaySB">
			<h2>FA SubFilter <span class="sf-update-status_x" style="font-weight: bold; color: #02cc02; float:right; clear:right; display: none;">Update successful!</span></h2>
			<br/>
			<strong>YCH</strong>
			<div class="control-panel-option">
				<div class="control-panel-item-1">
					<p>Enable/Disable the ability to see YCH submissions.</p>
				</div>
				<div class="control-panel-item-2">
					<select id="ychid" style="width:300px;">
					<option value="unset" disabled>--Select A Value--</option>
					<option value="yes">Hide Submissions</option>
					<option value="no">Show Submissions</option>
					</select>
				</div>
			</div>
			<strong>Stream</strong>
			<div class="control-panel-option">
				<div class="control-panel-item-1">
						<p>Enable/Disable the ability to see Stream submissions.</p>
				</div>
				<div class="control-panel-item-2">
					<select id="streamid" style="width:300px;">
					<option value="unset" disabled>--Select A Value--</option>
					<option value="yes">Hide Submissions</option>
					<option value="no">Show Submissions</option>
					</select>
				</div>
			</div>
				<div class="button-nav">
					<div class="button-nav-item">
						<input class="button mobile-button" id="sf_saveit" type="button" value="Save SubFilter Settings*">
					</div>
				</div>
						<br/><b>*Updates take effect from the next page load</b><br/><span style="font-size:10px;">SubFilter by <a href="https://www.furaffinity.net/user/feralfrenzy" style="border-bottom:1px dotted white;">JaysonHusky</a></span>
		</div>
	`);
    }
            else {
               $('.footer').before(`<table cellpadding="0" cellspacing="1" border="0" class="section maintable" style="width: 60%; margin: 10px auto;">
					<tbody>
						<tr>
							<td height="22" class="cat links">&nbsp;
								<strong>SubFilter</strong>
								<span class="sf-update-status_x" style="font-weight: bold; color: #02cc02; float:right; clear:right; display: none;">Update successful!</span>
							</td>
						</tr>
						<tr>
							<td class="alt1 addpad ucp-site-settings" align="center">
								<table cellpadding="0" cellspacing="1" border="0">
									<tbody>
										<tr>
											<th><strong>YCH/Stream</strong></th>
											<td>
												<label>YCH:</label>
												<select id="ychid" style="width:300px;">
													<option value="unset" disabled>--Select A Value--</option>
													<option value="yes">Hide Submissions</option>
													<option value="no">Show Submissions</option>
												</select>
												<br/>
												<label>Stream:</label>
												<select id="streamid" style="width:300px;">
													<option value="unset" disabled>--Select A Value--</option>
													<option value="yes">Hide Submissions</option>
													<option value="no">Show Submissions</option>
												</select>
											</td>
											<td class="option-description">
												Enable/Disable the ability to see YCH submissions.
											</td>
										</tr>
										</tr>
										<th class="noborder">&nbsp;</th>
										<td class="noborder">&nbsp;</td>
										<td class="option-description noborder">
											<br><input class="button mobile-button" id="sf_saveit" type="button" value="Save SubFilter Settings*"><br/>
											<span style="font-size:10px;">FA Journal Breakdown by <a href="https://www.furaffinity.net/user/feralfrenzy" style="border-bottom:1px dotted white;">JaysonHusky</a></span><br/><br/>
											<b>*Updates take effect from the next page load</b>
										</td>
									</tr>
								</tbody>
							</table>`);
            }
        }
    // Load the users settings
    $.each(["ych_control","stream_control"],function(i,l){
        SF_LoadCP(l);
    });
    // Check and Run the Tweaks if required
    if(SF_Load_Tweaks('ych_control')=="yes"){ExecuteTweak('noYCH');}else{/* Do Nothing */}
    if(SF_Load_Tweaks('stream_control')=="yes"){ExecuteTweak('noSTREAM');}else{/* Do Nothing */}
    console.log("YCH's Hidden: "+YCHSHidden);console.log("Streams Hidden: "+StreamsHidden);
})();