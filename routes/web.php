<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', function () use ($app) {
    return $app->version();
});

$app->group(['prefix' => 'api/v1', 'middleware' => 'BasicAuth', 'namespace' => 'App\Http\Controllers'], function($app)
{
	/*
	|--------------------------------------------------------------------------
	| Banner
	|--------------------------------------------------------------------------
	*/
    $app->get('banner','BannerController@index');

    $app->get('banner/{id}','BannerController@getbanner');

    $app->post('banner','BannerController@createbanner');

    $app->put('banner/{id}','BannerController@updatebanner');

    $app->delete('banner/{id}','BannerController@deletebanner');

    /*
	|--------------------------------------------------------------------------
	| Comment
	|--------------------------------------------------------------------------
	*/
    $app->get('comment/index','CommentController@index');

    $app->get('comment/show/{id}','CommentController@show');

    $app->post('comment/create','CommentController@create');

    $app->put('comment/update/{id}','CommentController@update');

    $app->delete('comment/delete/{id}','CommentController@delete');
});

// Crawler API
$app->group(['prefix' => 'api/v1', 'middleware' => 'BasicAuth', 'namespace' => 'App\Http\Controllers'], function($app)
{
    $app->get('airline','TicketCrawlers\AirlineController@index');

    $app->get('airline/test','TicketCrawlers\AirlineController@test');
    $app->post('airline/vietjet','TicketCrawlers\AirlineController@vietjet');

});
