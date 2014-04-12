/**
 * This file is part of the DreamFactory Services Platform(tm) (DSP)
 *
 * DreamFactory Services Platform(tm) <http://github.com/dreamfactorysoftware/dsp-core>
 * Copyright 2012-2014 DreamFactory Software, Inc. <support@dreamfactory.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * To change this template use File | Settings | File Templates.
 */
var GroupCtrl = function( $scope, Group, App, $timeout ) {
	$scope.$on(
		'$routeChangeSuccess', function() {
			$( window ).resize();
		}
	);
	$scope.group = {apps: []};
	$scope.Groups = Group.get();
	$scope.Apps = App.get();
	$scope.action = "Create";
	$( '#update_button' ).hide();

	$scope.save = function() {

		var id = $scope.group.id;
		Group.update(
			{id: id}, $scope.group, function() {
				$scope.promptForNew();
				window.top.Actions.updateSession( "update" );
				$.pnotify(
					{
						title: 'App Groups',
						type:  'success',
						text:  'Updated Successfully.'
					}
				);
			}
		);
	};
	$scope.create = function() {

		Group.save(
			$scope.group, function( data ) {
				$scope.Groups.record.push( data );
				$scope.promptForNew();
				window.top.Actions.updateSession( "update" );
				$.pnotify(
					{
						title: 'App Groups',
						type:  'success',
						text:  'Created Successfully.'
					}
				);
			}
		);
	};
	$scope.isAppInGroup = function() {
		if ( $scope.group ) {
			var id = this.app.id;
			var assignedApps = $scope.group.apps;
			assignedApps = $( assignedApps );
			var inGroup = false;
			assignedApps.each(
				function( index, val ) {
					if ( val.id == id ) {
						inGroup = true;
					}
				}
			);

		}
		return inGroup;
	};
	$scope.addAppToGroup = function( checked ) {

		if ( checked == true ) {
			$scope.group.apps.push( this.app );
		}
		else {
			$scope.group.apps = removeByAttr( $scope.group.apps, 'id', this.app.id );
		}
	};
	//noinspection ReservedWordAsName
	$scope.delete = function() {
		var which = this.group.name;
		if ( !which || which == '' ) {
			which = "the group?";
		}
		else {
			which = "the group '" + which + "'?";
		}
		if ( !confirm( "Are you sure you want to delete " + which ) ) {
			return;
		}
		var id = this.group.id;
		Group.delete(
			{ id: id }, function() {
				$scope.promptForNew();
				$.pnotify(
					{
						title: 'App Groups',
						type:  'success',
						text:  'Deleted Successfully.'
					}
				);

				$( "#row_" + id ).fadeOut();
			}, function( response ) {
				var code = response.status;
				if ( code == 401 ) {
					window.top.Actions.doSignInDialog( "stay" );
					return;
				}
				$.pnotify(
					{
						title:    'Error',
						type:     'error',
						hide:     false,
						addclass: "stack-bottomright",
						text:     getErrorString( response )
					}
				);
			}
		);
	};
	$scope.promptForNew = function() {
		$scope.action = "Create";
		$scope.group = {apps: []};
		$( '#save_button' ).show();
		$( '#update_button' ).hide();
		$( "tr.info" ).removeClass( 'info' );
		$( window ).scrollTop( 0 );
	};
	$scope.showDetails = function() {
		$scope.action = "Update";
		$scope.group = this.group;
		$( '#save_button' ).hide();
		$( '#update_button' ).show();
		$( "tr.info" ).removeClass( 'info' );
		$( '#row_' + $scope.group.id ).addClass( 'info' );
	}

};