import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { usePlayerStore } from '../lib/playerStore';
import * as DocumentPicker from 'expo-document-picker';
import { Music, Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Sparkles } from 'lucide-react-native';

export default function PlayerScreen() {
  const { trackA, trackB, isPlaying, isTransitioning, setTrackAFile, setTrackBFile, togglePlay, triggerTransition, progress } = usePlayerStore();

  const handlePickAudio = async (deck: 'A' | 'B') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (deck === 'A') {
          await setTrackAFile(file.uri, file.name);
        } else {
          await setTrackBFile(file.uri, file.name);
        }
      }
    } catch (err) {
      console.log('Error picking file', err);
    }
  };

  const TrackCard = ({ label, track, onPick }: { label: string, track: any, onPick: () => void }) => (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      
      <TouchableOpacity style={styles.artContainer} onPress={onPick} activeOpacity={0.8}>
        {track.uri ? (
          <View style={styles.artFilled}>
            <Music color="#8b5cf6" size={48} opacity={0.5} />
          </View>
        ) : (
          <View style={styles.artEmpty}>
            <Music color="#a1a1aa" size={32} />
            <Text style={styles.uploadText}>Tap to load track</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>BPM</Text>
          <Text style={styles.statValue}>
            {track.isLoading ? '...' : (track.bpm ? Math.round(track.bpm) : '--')}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>KEY</Text>
          <Text style={styles.statValue}>
            {track.isLoading ? '...' : (track.key || '--')}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>FlowMix Engine</Text>
        
        <View style={styles.decksContainer}>
          <TrackCard label="Deck A" track={trackA} onPick={() => handlePickAudio('A')} />
          <View style={styles.spacer} />
          <TrackCard label="Deck B" track={trackB} onPick={() => handlePickAudio('B')} />
        </View>

        <View style={styles.controlsCard}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          
          <View style={styles.transportControls}>
            <TouchableOpacity style={styles.iconBtn}>
              <Shuffle color="#a1a1aa" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <SkipBack color="#fafafa" size={32} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.playBtn, !trackA.uri && styles.playBtnDisabled]} 
              onPress={togglePlay}
              disabled={!trackA.uri}
            >
              {isPlaying ? (
                <Pause color="#fafafa" size={32} fill="#fafafa" />
              ) : (
                <Play color="#fafafa" size={32} fill="#fafafa" style={{ marginLeft: 4 }} />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn}>
              <SkipForward color="#fafafa" size={32} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Repeat color="#a1a1aa" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.transitionContainer}>
            <View style={styles.transitionHeader}>
              <View style={styles.sparkleIcon}>
                <Sparkles color="#8b5cf6" size={20} />
              </View>
              <View>
                <Text style={styles.transitionTitle}>Intelligent Crossfade</Text>
                <Text style={styles.transitionSub}>Blend Deck A into Deck B</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[
                styles.transitionBtn,
                (!trackA.bpm || !trackB.bpm || isTransitioning) && styles.transitionBtnDisabled
              ]}
              onPress={triggerTransition}
              disabled={!trackA.bpm || !trackB.bpm || isTransitioning}
            >
              {isTransitioning ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.transitionBtnText}>Trigger Transition</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fafafa',
    marginBottom: 30,
    letterSpacing: 0.5,
  },
  decksContainer: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  spacer: {
    height: 20,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#18181b',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  cardLabel: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  artContainer: {
    width: 200,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#09090b',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  artEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: '#a1a1aa',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  artFilled: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  trackTitle: {
    color: '#fafafa',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    minWidth: 80,
  },
  statLabel: {
    color: '#71717a',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    color: '#d8b4fe',
    fontSize: 16,
    fontWeight: '600',
  },
  controlsCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#18181b',
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#27272a',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 32,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 3,
  },
  transportControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 32,
  },
  iconBtn: {
    padding: 8,
  },
  playBtn: {
    width: 72,
    height: 72,
    backgroundColor: '#8b5cf6',
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  playBtnDisabled: {
    opacity: 0.5,
  },
  transitionContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 24,
  },
  transitionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sparkleIcon: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    padding: 8,
    borderRadius: 12,
  },
  transitionTitle: {
    color: '#fafafa',
    fontSize: 14,
    fontWeight: '600',
  },
  transitionSub: {
    color: '#a1a1aa',
    fontSize: 12,
  },
  transitionBtn: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transitionBtnDisabled: {
    backgroundColor: '#27272a',
  },
  transitionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
