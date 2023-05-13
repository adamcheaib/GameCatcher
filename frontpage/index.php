<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./frontpage/css/frontpage.css">
    <link rel="stylesheet" href="./frontpage/css/scroll_function_style.css">
    <title>GameCatcher</title>
</head>

<body>
    <div id="frontpage_wrapper">
        <div id="sidebar">
            <div id="main_page"></div>
            <div id="saved"></div>
            <div id="chat"></div>
            <div id="settings"></div>

        </div>


        <div id="center_piece">

            <div id="profile_and_welcome_text">
                <div id="welcome_text">
                    <h1>Hello !</h1>
                    <p>Lets begin todays game browsing</p>
                </div>

                <div id="profile_and_welcome_text_wrapper">
                    <div id="search_function"></div>
                    <div id="profile"></div>
                </div>
            </div>



            <div id="games_section">

                <div id="genres">
                    <div id="first_arrow">&#8592;</div>
                    <div id="genre_wrapper">
                        <div id="first_genra"></div>
                        <div id="second_genra"></div>
                        <div id="third_genra"></div>
                        <div id="fourth_genra"></div>
                    </div>
                    <div id="second_arrow"> &#8594; </div>
                </div>

                <div id="platfroms">
                    <div id="platfroms_Text"></div>
                    <div class="wrapper">
                        <div data-id="186" class="platform" id="Xbox"></div>
                        <div data-id="187" class="platform" id="Playstation"></div>
                        <div data-id="7" class="platform" id="Nintendo_Switch"></div>
                        <div data-id="4" class="platform" id="PC"></div>
                    </div>
                </div>

                <div id="games">
                    <div id="first_arrow2">&#8592;</div>
                    <div class="wrapper">
                        <div class="game_1"></div>
                        <div class="game_2"></div>
                        <div class="game_3"></div>
                        <div class="game_4"></div>
                    </div>
                    <div id="second_arrow2"> &#8594; </div>
                </div>
            </div>


            <footer>
                
            </footer>
        </div>

    </div>
    <script src="./frontpage/js/front_page.js"></script>
    <script type="module" src="./frontpage/js/forum.js"></script>
    <script type="module" src="./frontpage/js/game_collection.js"></script>
    <script type="module" src="../utils/functions.js"></script>
    <script type="module" src="../utils/fetch_functions.js"></script>
</body>

</html>