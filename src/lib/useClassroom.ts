import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';
import { loadClassroom } from './classroomApi';
import type { ClassroomResponse, ClassroomRoom } from './classroomTypes';

export function useClassroom(id: string, enabled: boolean) {
  const [room, setRoom] = useState<ClassroomRoom | null>(null);
  const [responses, setResponses] = useState<ClassroomResponse[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const activeId = useRef(id);
  activeId.current = id;
  const refresh = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    try {
      const next = await loadClassroom(id);
      if (activeId.current !== id) return;
      setRoom(next.room);
      setResponses(next.responses);
      setError('');
    } catch (cause) {
      if (activeId.current === id) setError(cause instanceof Error ? cause.message : 'Could not load classroom.');
    } finally {
      if (activeId.current === id) setLoading(false);
    }
  }, [id, enabled]);
  useEffect(() => {
    activeId.current = id;
    if (!enabled) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void refresh();
    let connected = false;
    const channel = supabase
      .channel(`classroom:${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'classroom_rooms',
          filter: `id=eq.${id}`,
        },
        () => void refresh(),
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'classroom_responses',
          filter: `room_id=eq.${id}`,
        },
        () => void refresh(),
      )
      .subscribe((status) => {
        connected = status === 'SUBSCRIBED';
        setLive(connected);
      });
    const timer = window.setInterval(() => {
      if (!connected) void refresh();
    }, 4000);
    return () => {
      activeId.current = '';
      window.clearInterval(timer);
      void supabase.removeChannel(channel);
    };
  }, [id, enabled, refresh]);
  return { room, responses, error, loading, live, refresh };
}
