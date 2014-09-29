var soundManager,
    soundPlayer,
    isPlaying = false,
    currentSongId,
    popularSongs;

$(document).ready(function () {
    getPopularSongs();

    soundManager.url = '/swfs/';
    soundManager.flashVersion = 9;
    soundManager.useFlashBlock = false;
    soundManager.useHighPerformance = true;
    soundManager.wmode = 'transparent';
    soundManager.useFastPolling = true;

    $("tr .clickToPlay").click(function () {
        var currentRow = $(this).closest("tr");
        currentRow.addClass("info");
        playSong(currentRow.attr('id'));
    });
    $(".player-play").click(function () {
        console.log($(this).attr("src"));
        if (isPlaying) {
            $(this).attr("src", "../images/play-icon-32.png");
            if (soundPlayer) {
                soundPlayer.pause();
            }
        } else {
            $(this).attr("src", "../images/pause-icon-32.png");
            if (soundPlayer) {
                soundPlayer.play();
            } else {
                playSong(1);
            }
        }
    });
});

function getPopularSongs() {
    $.get("http://localhost:3000/popular", function (data) {
        popularSongs = data;
        preloadSongsInSoundManager();
    });
}

function preloadSongsInSoundManager() {
    $.each(popularSongs, function (i, song) {
        soundManager.createSound({
            url: song.s_mp3,
            id: song.h_mediaid,
            onplay: function () {
                isPlaying = true
            },
            onpause: function () {
                isPlaying = false
            },
            onresume: function () {
                isPlaying = true
            }
        });
    })
}

function playSong(placeInPopularList) {
    //var streamTrack = "/tracks/" + popularSongs[parseInt(placeInPopularList) - 1].soundcloud_id;
    var h_mediaid = popularSongs[parseInt(placeInPopularList) - 1].h_mediaid;
    console.log("playing: " + isPlaying);
    if (isPlaying && currentSongId == h_mediaid) {
        soundPlayer.pause();
    } else {
        currentSongId = h_mediaid;
        if (soundPlayer)
            soundPlayer.pause();
        soundPlayer = soundManager.getSoundById(h_mediaid);
        soundPlayer.play();
    }

}