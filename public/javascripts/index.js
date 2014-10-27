var currentSongRow,
    currentPosition,
    playButton,
    forwardButton,
    rewindButton,
    popularSongsDTO,
    player,
    currentSongPosition,
    currentSongDuration,
    progressPlaying,
    progressLoading,
    progressVolume,
    isUpdateProgressPlaying,
    isDropped;

var eventProgress;
$(document).ready(function () {
    getPopularSongs();

    //TODO skip song if it can not be loaded
    player = new Player();
    player.init();
    player.setCallbackOnPlay(onPlayUIUpdate);
    player.setCallbackOnPause(onPauseUIUpdate);
    player.setCallbackNextSong(onSongFinished);
    player.setCallbackDurationInSeconds(updateUIDurationInSeconds);
    player.setCallbackWhilePlaying(whilePlaying);
    player.setCallbackWhileLoading(whileLoading);

    currentSongRow = $("table:first tr:eq(1)");
    currentSongPosition = $(".player-currentSongPosition");
    currentSongPosition.text("00:00");
    currentSongDuration = $(".player-currentSongDuration");
    currentSongDuration.text("00:00");
    progressLoading = $("#player-progressLoading");
    progressPlaying = $("#player-progressPlaying");
    progressVolume = $("#player-progressVolume");

    // enable bootstrap tooltop for all "data-toggle" elements
    $('[data-toggle="tooltip"]').tooltip();

    isUpdateProgressPlaying = false;
    progressPlaying.sGlide({
        startAt: 0,
        height: 10,
        showKnob: false,
        disabled: false,
        pill: false,
        drag: function(o) {
            isUpdateProgressPlaying = true;
            if (isDropped) { // after "drop", "drag" is called once
                isDropped = false;
                isUpdateProgressPlaying = false;
                player.setPosition(o.value);
            }
        },
        drop: function () {
            isDropped = true;
        }
    });
    progressVolume.sGlide({
        startAt: 100,
        height: 10,
        showKnob: false,
        disabled: false,
        pill: false,
        drag: function(o) {
            player.setVolume(parseInt(o.value));
        }
    });

    $("tr .clickToPlay").click(function () {
        if (player.isPlaying() && $(this).closest("tr").index() == currentPosition) {
            player.pause();
        } else {
            selectCurrentRow($(this).closest("tr").index());
            player.play(popularSongsDTO[parseInt(currentPosition)].h_mediaid);
        }
    });

    playButton = $(".player-play");
    playButton.click(function () {
        if (player.isPlaying()) {
            player.pause();
        } else {
            player.play(popularSongsDTO[parseInt(currentPosition)].h_mediaid);
        }
    });

    forwardButton = $(".player-forward");
    forwardButton.click(function () {
        if (currentPosition < 49) {
            currentPosition++;
            selectCurrentRow(currentPosition);
            if (player.isPlaying()) {
                player.play(popularSongsDTO[parseInt(currentPosition)].h_mediaid);
            }
        }
    });

    rewindButton = $(".player-rewind");
    rewindButton.click(function () {
        if (currentPosition > 0) {
            currentPosition--;
            selectCurrentRow(currentPosition);
            if (player.isPlaying()) {
                player.play(popularSongsDTO[parseInt(currentPosition)].h_mediaid);
            }
        }
    });
});

function selectCurrentRow(position) {
    currentPosition = position;
    position++; // Skip header
    currentSongRow.removeClass("info");
    currentSongRow = $("table:first tr:eq(" + position + ")");
    currentSongRow.addClass("info");
    updateArtistAndTitleText();
}

function updateArtistAndTitleText() {
    var currentArtist = $(".player-artist");
    currentArtist.text(currentSongRow.children("td").eq(2).text());
    var currentTitle = $(".player-title");
    currentTitle.text(currentSongRow.children("td").eq(3).text());
    isUpdateProgressPlaying = false;
}

function getPopularSongs() {
    $.get("/popular", function (data) {
        popularSongsDTO = [];
        data.forEach(function(entry) {
            popularSongsDTO.push(entry.song);
        });
        player.preloadSong(popularSongsDTO);
        selectCurrentRow(0);
    });
}

function onPlayUIUpdate() {
    playButton.attr("src", "../images/pause-icon-32.png");
}

function onPauseUIUpdate() {
    playButton.attr("src", "../images/play-icon-32.png");
}

function onSongFinished() {
    if (currentPosition < 49) {
        currentPosition++;
        selectCurrentRow(currentPosition);
        player.play(popularSongsDTO[parseInt(currentPosition)].h_mediaid);
    } else {
        currentPosition = 0;
        player.play(popularSongsDTO[parseInt(currentPosition)].h_mediaid);
    }
}

function updateUIDurationInSeconds(duration) {
    currentSongDuration.text(secondFormatter(duration));
}

function whileLoading(hundredPercent) {
    progressLoading.css("aria-valuenow", hundredPercent);
    progressLoading.css("width", hundredPercent + "%");
}

function whilePlaying(currentSecond, durationInSeconds) {
    currentSongPosition.text(secondFormatter(currentSecond));

    if (!isUpdateProgressPlaying) {
        var hundredPercent = (currentSecond / durationInSeconds) * 100;
        progressPlaying.sGlide(
            'startAt',
            hundredPercent	// Number, percent
        );
    }
}

function secondFormatter (second) {
    var sec_num = parseInt(second, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
}