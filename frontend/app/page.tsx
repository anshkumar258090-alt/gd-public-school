'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Team from '@/components/Team';
import Facilities from '@/components/Facilities';
import Media from '@/components/Media';
import Notices from '@/components/Notices';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

import {
  SchoolInfo,
  SchoolStats,
  TeamMember,
  MediaItem,
  SchoolNotice,
} from '@/lib/types';
import {
  DEFAULT_SCHOOL,
  DEFAULT_STATS,
  DEFAULT_TEAM,
  DEFAULT_NOTICES,
  getSchoolInfo,
  getSchoolStats,
  getTeamMembers,
  getMediaGallery,
  getNotices,
} from '@/lib/api';

export default function HomePage() {
  const [school, setSchool] = useState<SchoolInfo>(DEFAULT_SCHOOL);
  const [stats, setStats] = useState<SchoolStats>(DEFAULT_STATS);
  const [team, setTeam] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [notices, setNotices] = useState<SchoolNotice[]>(DEFAULT_NOTICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [schoolRes, statsRes, teamRes, mediaRes, noticesRes] =
          await Promise.allSettled([
            getSchoolInfo(),
            getSchoolStats(),
            getTeamMembers(),
            getMediaGallery(),
            getNotices(),
          ]);

        if (schoolRes.status === 'fulfilled' && schoolRes.value) {
          setSchool(schoolRes.value);
        }
        if (statsRes.status === 'fulfilled' && statsRes.value) {
          setStats(statsRes.value);
        }
        if (teamRes.status === 'fulfilled' && teamRes.value) {
          setTeam(teamRes.value);
        }
        if (mediaRes.status === 'fulfilled' && mediaRes.value) {
          setMedia(mediaRes.value);
        }
        if (noticesRes.status === 'fulfilled' && noticesRes.value) {
          setNotices(noticesRes.value);
        }
      } catch (e) {
        console.error('Error fetching school data:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar school={school} />
      <main className="flex-1">
        <Hero school={school} stats={stats} />
        <About school={school} />
        <Team team={team} />
        <Facilities />
        <Media mediaList={media} />
        <Notices notices={notices} />
        <Contact school={school} />
      </main>
      <Footer school={school} />
    </div>
  );
}
