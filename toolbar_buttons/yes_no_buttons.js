function clickFeedbackYes() {
    $(".feedback-btn-no, .dislike-button").each(function() {
        $(this).removeClass('active');
        $(this).prop('disabled', true);
        $(this).addClass('disable');
    });
    $(".feedback-btn-yes, .like-button").each(function() {
        $(this).addClass('active');
        $(this).prop('disabled', true);
    });
    data = 'type=yes';
    sendFeedbackRequest(data);
}

function clickFeedbackNo() {
    $(".feedback-btn-yes, .like-button").each(function() {
        $(this).removeClass('active');
        $(this).prop('disabled', true);
        $(this).addClass('disable');
    });
    $(".feedback-btn-no, .dislike-button").each(function() {
        $(this).addClass('active');
        $(this).prop('disabled', true);
    });
    data = 'type=no';
    sendFeedbackRequest(data);
}
