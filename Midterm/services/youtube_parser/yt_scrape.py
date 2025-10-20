"""
YouTube video scraping and transcript processing functionality.
"""

import requests # type: ignore
from .type import FetchedTranscript
from youtube_transcript_api import YouTubeTranscriptApi # type: ignore
from typing import List, Tuple, Dict, Any, Optional
import time
from xml.etree.ElementTree import ParseError



class YouTubeScraper:
    def __init__(self, api_key:str, language:str = "en", max_results:int=50): 
        self.api_key = api_key
        self.language = language
        self.max_results = max_results

    def get_transcript(self, video_id: str, max_retries: int = 3, delay: float = 0.5) -> FetchedTranscript:
        """
        Fetch transcript for a given video ID with retry mechanism.
        
        Args:
            video_id: YouTube video ID
            max_retries: Maximum number of retry attempts
            delay: Delay between retries in seconds

        Returns:
            FetchedTranscript object
            
        Raises:
            Exception: If transcript cannot be fetched after all retries
        """
        ytt_api = YouTubeTranscriptApi()
        last_exception = None
        
        for attempt in range(max_retries):
            try:
                ytt_transcript = ytt_api.fetch(video_id, languages=[self.language])
                return ytt_transcript
            except ParseError as e:
                last_exception = e
                if attempt < max_retries - 1:
                    time.sleep(delay)
                continue
            except Exception as e:
                raise e
                
        raise last_exception or Exception(f"Failed to fetch transcript for video {video_id}")

    def transcript_to_dict(self, transcript: FetchedTranscript, title: str) -> Dict[str, Any]:
        """
        Convert transcript to dict format.
        
        Args:
            transcript: FetchedTranscript object
            title: Video title
        
        Returns:
            Dictionary containing transcript data
        """
        snippets = ""
        for snippet in transcript.snippets:
            snippets += (snippet.text + ". ")

        transcript_dict = {
            "title": title,
            "video_id": transcript.video_id,
            "is_generated": transcript.is_generated,
            "language_code": transcript.language_code,
            "snippets": snippets
        }

        return transcript_dict

    def fetch_videos_by_query(self, query: str) -> List[Tuple[str, str]]:
        """
        Fetch video IDs and titles from YouTube search.
        
        Args:
            query: Search query string
        
        Returns:
            List of tuples containing (video_id, title)
        """
        url = 'https://www.googleapis.com/youtube/v3/search'
        params: Dict[str, Any] = {
            'part': 'snippet',
            'q': query,
            'type': 'video',
            'maxResults': self.max_results,
            'key': self.api_key
        }
        response = requests.get(url, params=params, timeout=(10, 60))  # (connect timeout, read timeout)
        data = response.json()

        return [(item['id']['videoId'], item['snippet']['title']) 
                for item in data.get('items', [])]

    def fetch_channel_videos_by_id(self, channel_id: str) -> List[Tuple[str, str]]:
        """
        Fetch video IDs and titles from a specific YouTube channel.

        Args:
            channel_id: YouTube channel ID
        
        Returns:
            List of tuples containing (video_id, title)
        """
        url = 'https://www.googleapis.com/youtube/v3/search'
        params: Dict[str, Any] = {
            'part': 'snippet',
            'channelId': channel_id,
            'type': 'video',
            'order': 'date',
            'maxResults': self.max_results,
            'key': self.api_key
        }
        response = requests.get(url, params=params)
        data = response.json()

        return [(item['id']['videoId'], item['snippet']['title']) 
                for item in data.get('items', [])]

    def get_channel_id_by_handle(self, handle: str) -> str:
        """
        Resolve a YouTube handle (e.g. '@TryToEat') to a channel ID.

        Args:
            handle: YouTube handle (e.g. '@TryToEat')
        
        Returns:
            Channel ID
        """
        url = 'https://www.googleapis.com/youtube/v3/channels'
        params: Dict[str, Any] = {
            'part': 'id',
            'forHandle': handle.lstrip('@'),
            'key': self.api_key
        }
        response = requests.get(url, params=params)
        data = response.json()

        items = data.get('items', [])
        if not items:
            raise ValueError(f"Channel not found for handle: {handle}")
        
        return items[0]['id']

    def fetch_video_by_id(self, video_id: str) -> List[Tuple[str, str]]:
        """
        Fetch video details by ID and return a list of (video_id, title) tuples.
        """
        url = 'https://www.googleapis.com/youtube/v3/videos'
        params: Dict[str, Any] = {
            'part': 'snippet',
            'id': video_id,
            'key': self.api_key
        }
        response = requests.get(url, params=params)
        data = response.json()
        items = data.get('items', [])
        return [(item['id'], item['snippet']['title']) for item in items]

    def process_videos(self, type: str = "id", arg: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Process videos by fetching them and their transcripts.
        Retries 3 times if there is an error per video. 

        Args:
            type: Type of search to perform
            arg: Argument for the search
        Returns:
            List of dicts containing video and transcript data
        """
        if arg is None:
            raise ValueError("arg parameter cannot be None")

        if type == "id":
            videos = self.fetch_video_by_id(arg)
        elif type == "query": 
            videos = self.fetch_videos_by_query(arg)
        elif type == 'channel_id': 
            videos = self.fetch_channel_videos_by_id(arg)
        else:
            raise ValueError(f"Invalid type: {type}")
        
        results = []
        for video_id, title in videos:
            success = False
            for attempt in range(4):
                try:
                    transcript = self.get_transcript(video_id)
                    video_dict = self.transcript_to_dict(transcript, title)
                    results.append(video_dict)
                    success = True
                    break 
                except Exception as e:
                    if attempt < 3:
                        print(f"Error processing video {video_id} (attempt {attempt+1}): {str(e)}. Retrying...")
                    else:
                        print(f"Failed to process video {video_id} after 4 attempts: {str(e)}")
            
            if not success:
                # If all attempts failed, add a placeholder dict with error information
                results.append({
                    "title": title,
                    "video_id": video_id,
                    "error": "Failed to fetch transcript",
                    "snippets": ""
                })
                
        return results



