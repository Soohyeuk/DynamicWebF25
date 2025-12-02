import pytest # type: ignore
from unittest.mock import Mock, patch
from youtube_parser.yt_scrape import YouTubeScraper
from youtube_parser.type import FetchedTranscript, FetchedTranscriptSnippet

@pytest.fixture
def youtube_scraper():
    return YouTubeScraper("fake_api_key")

@pytest.fixture
def mock_transcript():
    class MockTranscript:
        def __init__(self):
            self.video_id = "test_video_id"
            self.language_code = "en"
            self.is_generated = False
            self.transcript = [
                {"text": "Hello", "start": 0.0, "duration": 1.0},
                {"text": "World", "start": 1.0, "duration": 1.0}
            ]
        def __iter__(self):
            return iter(self.transcript)
    return MockTranscript()

def test_init():
    scraper = YouTubeScraper("test_key", "ko", 100)
    assert scraper.api_key == "test_key"
    assert scraper.language == "ko"
    assert scraper.max_results == 100

@patch('youtube_parser.yt_scrape.YouTubeTranscriptApi')
def test_get_transcript(mock_ytt_api, youtube_scraper, mock_transcript):
    mock_ytt_api.return_value.fetch.return_value = mock_transcript
    
    transcript = youtube_scraper.get_transcript("test_video_id")
    
    assert isinstance(transcript, FetchedTranscript)
    assert transcript.video_id == "test_video_id"
    assert transcript.language_code == "en"
    assert transcript.is_generated == False
    assert len(transcript.snippets) == 2
    assert isinstance(transcript.snippets[0], FetchedTranscriptSnippet)
    assert transcript.snippets[0].text == "Hello"

def test_transcript_to_dict(youtube_scraper):
    transcript = FetchedTranscript(
        snippets=[
            FetchedTranscriptSnippet(text="Hello", start=0.0, duration=1.0),
            FetchedTranscriptSnippet(text="World", start=1.0, duration=1.0)
        ],
        video_id="test_video_id",
        language_code="en",
        is_generated=False
    )
    
    result = youtube_scraper.transcript_to_dict(transcript, "Test Title")
    
    assert result["title"] == "Test Title"
    assert result["video_id"] == "test_video_id"
    assert result["language_code"] == "en"
    assert result["is_generated"] == False
    assert result["snippets"] == "Hello. World. "

@patch('youtube_parser.yt_scrape.requests.get')
def test_fetch_videos_by_query(mock_get, youtube_scraper):
    mock_response = Mock()
    mock_response.json.return_value = {
        "items": [
            {
                "id": {"videoId": "video1"},
                "snippet": {"title": "Title 1"}
            },
            {
                "id": {"videoId": "video2"},
                "snippet": {"title": "Title 2"}
            }
        ]
    }
    mock_get.return_value = mock_response
    
    results = youtube_scraper.fetch_videos_by_query("test query")
    
    assert len(results) == 2
    assert results[0] == ("video1", "Title 1")
    assert results[1] == ("video2", "Title 2")
    mock_get.assert_called_once()

@patch('youtube_parser.yt_scrape.requests.get')
def test_fetch_channel_videos_by_id(mock_get, youtube_scraper):
    mock_response = Mock()
    mock_response.json.return_value = {
        "items": [
            {
                "id": {"videoId": "video1"},
                "snippet": {"title": "Title 1"}
            }
        ]
    }
    mock_get.return_value = mock_response
    
    results = youtube_scraper.fetch_channel_videos_by_id("channel123")
    
    assert len(results) == 1
    assert results[0] == ("video1", "Title 1")
    mock_get.assert_called_once()

@patch('youtube_parser.yt_scrape.requests.get')
def test_get_channel_id_by_handle(mock_get, youtube_scraper):
    mock_response = Mock()
    mock_response.json.return_value = {
        "items": [{"id": "channel123"}]
    }
    mock_get.return_value = mock_response
    
    channel_id = youtube_scraper.get_channel_id_by_handle("@TestChannel")
    
    assert channel_id == "channel123"
    mock_get.assert_called_once()

@patch('youtube_parser.yt_scrape.requests.get')
def test_get_channel_id_by_handle_not_found(mock_get, youtube_scraper):
    mock_response = Mock()
    mock_response.json.return_value = {"items": []}
    mock_get.return_value = mock_response
    
    with pytest.raises(ValueError, match="Channel not found for handle: @TestChannel"):
        youtube_scraper.get_channel_id_by_handle("@TestChannel")

@patch('youtube_parser.yt_scrape.requests.get')
def test_fetch_video_by_id(mock_get, youtube_scraper):
    mock_response = Mock()
    mock_response.json.return_value = {
        "items": [
            {
                "id": "video1",
                "snippet": {"title": "Title 1"}
            }
        ]
    }
    mock_get.return_value = mock_response
    
    results = youtube_scraper.fetch_video_by_id("video1")
    
    assert len(results) == 1
    assert results[0] == ("video1", "Title 1")
    mock_get.assert_called_once()

def test_process_videos_invalid_type(youtube_scraper):
    with pytest.raises(ValueError, match="Invalid type: invalid"):
        youtube_scraper.process_videos(type="invalid", arg="test")

def test_process_videos_none_arg(youtube_scraper):
    with pytest.raises(ValueError, match="arg parameter cannot be None"):
        youtube_scraper.process_videos(arg=None)

@patch.object(YouTubeScraper, 'fetch_video_by_id')
@patch.object(YouTubeScraper, 'get_transcript')
def test_process_videos_success(mock_get_transcript, mock_fetch_video, youtube_scraper, mock_transcript):
    mock_fetch_video.return_value = [("video1", "Title 1")]
    mock_get_transcript.return_value = FetchedTranscript(
        snippets=[FetchedTranscriptSnippet(text="Test", start=0.0, duration=1.0)],
        video_id="video1",
        language_code="en",
        is_generated=False
    )
    
    results = youtube_scraper.process_videos(type="id", arg="video1")
    
    assert len(results) == 1
    assert results[0]["title"] == "Title 1"
    assert results[0]["video_id"] == "video1"
    assert results[0]["snippets"] == "Test. "

@patch.object(YouTubeScraper, 'fetch_video_by_id')
@patch.object(YouTubeScraper, 'get_transcript')
def test_process_videos_retry_success(mock_get_transcript, mock_fetch_video, youtube_scraper, mock_transcript):
    mock_fetch_video.return_value = [("video1", "Title 1")]
    mock_get_transcript.side_effect = [Exception("First try"), Exception("Second try"), 
        FetchedTranscript(
            snippets=[FetchedTranscriptSnippet(text="Test", start=0.0, duration=1.0)],
            video_id="video1",
            language_code="en",
            is_generated=False
        )
    ]
    
    results = youtube_scraper.process_videos(type="id", arg="video1")
    
    assert len(results) == 1
    assert results[0]["title"] == "Title 1"
    assert mock_get_transcript.call_count == 3

@patch.object(YouTubeScraper, 'fetch_video_by_id')
@patch.object(YouTubeScraper, 'get_transcript')
def test_process_videos_all_retries_fail(mock_get_transcript, mock_fetch_video, youtube_scraper):
    mock_fetch_video.return_value = [("video1", "Title 1")]
    mock_get_transcript.side_effect = Exception("Error")
    
    results = youtube_scraper.process_videos(type="id", arg="video1")
    
    assert len(results) == 0
    assert mock_get_transcript.call_count == 4

@patch('youtube_parser.yt_scrape.YouTubeTranscriptApi')
def test_process_videos_with_retries(mock_ytt_api, youtube_scraper):
    # Mock get_transcript to fail 2 times then succeed
    fail_count = [0]
    def mock_get_transcript(video_id):
        if fail_count[0] < 2:
            fail_count[0] += 1
            raise Exception("Test error")
        return FetchedTranscript(
            snippets=[FetchedTranscriptSnippet(text="test", start=0, duration=1)],
            video_id="test_id",
            language_code="en",
            is_generated=False
        )
    
    youtube_scraper.get_transcript = mock_get_transcript
    youtube_scraper.fetch_video_by_id = lambda x: [("test_id", "Test Title")]
    
    # Process videos - should succeed after retries
    results = youtube_scraper.process_videos(type="id", arg="test_id")
    assert len(results) == 1
    assert results[0]["title"] == "Test Title"

@patch('youtube_parser.yt_scrape.YouTubeTranscriptApi')
def test_process_videos_max_retries_failure(mock_ytt_api, youtube_scraper):
    # Mock get_transcript to always fail
    def mock_get_transcript(video_id):
        raise Exception("Test error")
    
    youtube_scraper.get_transcript = mock_get_transcript
    youtube_scraper.fetch_video_by_id = lambda x: [("test_id", "Test Title")]
    
    # Process videos - should handle max retries gracefully
    results = youtube_scraper.process_videos(type="id", arg="test_id")
    assert len(results) == 0  # No results due to failure
