import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, AppState, TouchableOpacity, Modal, Platform } from 'react-native';
import Video from 'react-native-video';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface VideoPlayerProps {
  url: string;
  headers?: Record<string, string>;
  qualityOptions?: Record<string, string>;
  onQualityChange?: (quality: string) => void;
  currentQuality?: string;
}

interface PlayerState {
  currentTime: number;
  duration: number;
  seeking: boolean;
  paused: boolean;
  buffered: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, headers, qualityOptions, onQualityChange, currentQuality }) => {
  const [error, setError] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTime: 0,
    duration: 0,
    seeking: false,
    paused: false,
    buffered: 0,
  });
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [showQualityOptions, setShowQualityOptions] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);    
  const videoRef = useRef<React.ElementRef<typeof Video> | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const speedButtonRef = useRef<View>(null);
  const qualityButtonRef = useRef<View>(null);
  const [speedMenuPosition, setSpeedMenuPosition] = useState({ top: 0, right: 0 });
  const [qualityMenuPosition, setQualityMenuPosition] = useState({ top: 0, right: 0 });

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const onSeek = (time: number) => {
    if (!playerState.seeking) return;
    
    if (videoRef.current) {
      videoRef.current.seek(time);
    }
    setPlayerState(prev => ({
      ...prev,
      currentTime: time
    }));
  };

  const onSlidingStart = () => {
    setPlayerState(prev => ({
      ...prev,
      seeking: true,
      paused: true
    }));
    showControlsTemporarily();
  };

  const onSlidingComplete = () => {
    if (videoRef.current) {
      videoRef.current.seek(playerState.currentTime);
    }
    setPlayerState(prev => ({
      ...prev,
      seeking: false,
      paused: false
    }));
  };

  const onTapSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.seek(time);
      setPlayerState(prev => ({
        ...prev,
        currentTime: time
      }));
    }
  };

  const togglePlayPause = () => {
    setPlayerState(prev => ({
      ...prev,
      paused: !prev.paused
    }));
    showControlsTemporarily();
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (isFullscreen) {
        videoRef.current.dismissFullscreenPlayer();
      } else {
        videoRef.current.presentFullscreenPlayer();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (!playerState.paused) {
        setShowControls(false);
        setShowSpeedOptions(false);
      }
    }, 3000);
  };

  const enterPiP = () => {
    if (!videoRef.current) return;
    videoRef.current.enterPictureInPicture?.();
  };

  useEffect(() => {
    if (controlsTimeoutRef.current) {
      return () => {
        clearTimeout(controlsTimeoutRef.current);
      };
    }
  }, []);

  const handleError = (error: any) => {
    console.error('Video Error:', JSON.stringify(error, null, 2));
    const errorMessage = `Video Error: ${error?.error?.errorString || error?.error?.errorCode || JSON.stringify(error)}`;
    setError(errorMessage);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        activeOpacity={1} 
        style={styles.videoContainer}
        onPress={() => {
          if (showControls) {
            setShowControls(false);
            setShowSpeedOptions(false);
            setShowQualityOptions(false);
            if (controlsTimeoutRef.current) {
              clearTimeout(controlsTimeoutRef.current);
            }
          } else {
            showControlsTemporarily();
          }
        }}
      >
        <Video
          resizeMode="contain"
          ref={videoRef}
          source={{
            uri: url,
            headers
          }}
          style={styles.video}
          allowsExternalPlayback
          controls={false}
          paused={playerState.paused}
          onError={handleError}
          playWhenInactive={true}
          onProgress={({ currentTime, playableDuration }) => {
            if (!playerState.seeking && Math.abs(currentTime - playerState.currentTime) < 1) {
              setPlayerState(prev => ({
                ...prev,
                currentTime,
                buffered: playableDuration || prev.buffered
              }));
            }
          }}
          onLoad={({ duration }) => setPlayerState(prev => ({ ...prev, duration }))}
          rate={playbackSpeed}
          enterPictureInPictureOnLeave
        />

        {showControls && (
          <View style={styles.controlsOverlay}>
            {/* Top Controls */}
            <View style={styles.topControls}>
              <View style={styles.topRightControls}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={enterPiP}
                >
                  <Ionicons 
                    name="tablet-landscape-outline" 
                    size={24} 
                    color="white" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Center Play/Pause Button */}
            <TouchableOpacity 
              style={styles.centerButton} 
              onPress={togglePlayPause}
            >
              <Ionicons 
                name={playerState.paused ? "play" : "pause"} 
                size={40} 
                color="white" 
              />
            </TouchableOpacity>

            {/* Bottom Controls Bar */}
            <View style={styles.bottomControls}>
              {/* Progress Slider */}
              <View style={styles.progressContainer}>
                {/* Buffering Progress */}
                <View style={[
                  styles.bufferingProgress,
                  {
                    width: `${(playerState.buffered / playerState.duration) * 100}%`
                  }
                ]} />
                <Slider
                  style={[styles.progressSlider, styles.sliderOverlay]}
                  value={playerState.currentTime}
                  minimumValue={0}
                  maximumValue={playerState.duration}
                  minimumTrackTintColor="#007AFF"
                  onValueChange={onSeek}
                  onSlidingStart={onSlidingStart}
                  onSlidingComplete={onSlidingComplete}
                  tapToSeek={true}
                />
              </View>

              <View style={styles.timeAndControls}>
                <Text style={styles.timeText}>
                  {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
                </Text>

                <View style={styles.rightControls}>
                  {/* Quality Button */}
                  {qualityOptions && Object.keys(qualityOptions).length > 0 && (
                    <View ref={qualityButtonRef}>
                      <TouchableOpacity 
                        style={styles.controlButton}
                        onPress={() => {
                          if (qualityButtonRef.current) {
                            qualityButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
                              setQualityMenuPosition({
                                top: pageY - 80,
                                right: 20
                              });
                              setShowQualityOptions(!showQualityOptions);
                              setShowSpeedOptions(false);
                            });
                          }
                        }}
                      >
                        <Text style={styles.speedText}>{currentQuality || 'Auto'}</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Playback Speed Button */}
                  <View ref={speedButtonRef}>
                    <TouchableOpacity 
                      style={styles.controlButton}
                      onPress={() => {
                        if (speedButtonRef.current) {
                          speedButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
                            setSpeedMenuPosition({
                              top: pageY - 80,
                              right: 20
                            });
                            setShowSpeedOptions(!showSpeedOptions);
                            setShowQualityOptions(false);
                          });
                        }
                      }}
                    >
                      <Text style={styles.speedText}>{playbackSpeed}x</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Fullscreen Button */}
                  <TouchableOpacity 
                    style={styles.controlButton}
                    onPress={toggleFullscreen}
                  >
                    <Ionicons 
                      name={isFullscreen ? "contract" : "expand"} 
                      size={24} 
                      color="white" 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Speed Options Menu Modal */}
      <Modal
        visible={showSpeedOptions}
        transparent={true}
        animationType="none"
        onRequestClose={() => {
          setShowSpeedOptions(false);
          setShowQualityOptions(false);
        }}
        supportedOrientations={['portrait', 'landscape']}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowSpeedOptions(false);
            setShowQualityOptions(false);
          }}
        >
          <View 
            style={[
              styles.speedOptionsContainer,
              {
                position: 'absolute',
                top: speedMenuPosition.top,
                right: speedMenuPosition.right,
              }
            ]}
          >
            {speedOptions.map((speed) => (
              <TouchableOpacity
                key={speed}
                style={[
                  styles.speedOption,
                  speed === playbackSpeed && styles.selectedSpeedOption,
                  speed === speedOptions[speedOptions.length - 1] && styles.lastSpeedOption
                ]}
                onPress={() => {
                  setPlaybackSpeed(speed);
                  setShowSpeedOptions(false);
                  setShowQualityOptions(false);
                }}
              >
                <Text style={[
                  styles.speedOptionText,
                  speed === playbackSpeed && styles.selectedSpeedOptionText
                ]}>
                  {speed}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Quality Options Menu Modal */}
      <Modal
        visible={showQualityOptions}
        transparent={true}
        animationType="none"
        onRequestClose={() => {
          setShowSpeedOptions(false);
          setShowQualityOptions(false);
        }}
        supportedOrientations={['portrait', 'landscape']}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowSpeedOptions(false);
            setShowQualityOptions(false);
          }}
        >
          <View 
            style={[
              styles.speedOptionsContainer,
              {
                position: 'absolute',
                top: qualityMenuPosition.top,
                right: qualityMenuPosition.right,
              }
            ]}
          >
            {qualityOptions && Object.entries(qualityOptions).map(([quality]) => (
              <TouchableOpacity
                key={quality}
                style={[
                  styles.speedOption,
                  quality === currentQuality && styles.selectedSpeedOption,
                  quality === Object.keys(qualityOptions).pop() && styles.lastSpeedOption
                ]}
                onPress={() => {
                  onQualityChange?.(quality);
                  setShowSpeedOptions(false);
                  setShowQualityOptions(false);
                }}
              >
                <Text style={[
                  styles.speedOptionText,
                  quality === currentQuality && styles.selectedSpeedOptionText
                ]}>
                  {quality}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 16/9,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  centerButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -25 },
      { translateY: -25 }
    ],
    padding: 0,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
  },
  progressContainer: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
  },
  bufferingProgress: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    left: 0,
  },
  progressSlider: {
    width: '100%',
    height: 30,
  },
  sliderOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  timeAndControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    marginLeft: 15,
    padding: 5,
  },
  speedText: {
    color: 'white',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  speedOptionsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderRadius: 8,
    padding: 4,
    width: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  speedOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  lastSpeedOption: {
    borderBottomWidth: 0,
  },
  selectedSpeedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  speedOptionText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
  },
  selectedSpeedOptionText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#ffebee',
    marginVertical: 10,
    borderRadius: 5,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 8,
  },
}); 