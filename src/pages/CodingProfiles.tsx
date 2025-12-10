import { useState } from 'react';
import { Code, Plus, ExternalLink, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EmptyState } from '@/components/EmptyState';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CodingProfile } from '@/types/workspace';
import { cn } from '@/lib/utils';

const platformIcons: Record<string, string> = {
  leetcode: '',
  gfg: '',
  codechef: '',
  codeforces: '',
  hackerrank: '',
  hackerearth: '',
  other: '</>'
};

export default function CodingProfiles() {
  const [profiles, setProfiles] = useLocalStorage<CodingProfile[]>('codingProfiles', []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<CodingProfile | null>(null);
  const [formData, setFormData] = useState({ name: '', platform: '', url: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProfile) {
      setProfiles(prev => prev.map(p => 
        p.id === editingProfile.id 
          ? { ...p, ...formData }
          : p
      ));
    } else {
      const newProfile: CodingProfile = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setProfiles(prev => [...prev, newProfile]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', platform: '', url: '' });
    setEditingProfile(null);
    setDialogOpen(false);
  };

  const handleEdit = (profile: CodingProfile) => {
    setEditingProfile(profile);
    setFormData({ name: profile.name, platform: profile.platform, url: profile.url });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
  };

  const getPlatformEmoji = (platform: string) => {
    const key = platform.toLowerCase().replace(/\s+/g, '');
    return platformIcons[key] || platformIcons.other;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Coding Profiles</h1>
          <p className="text-muted-foreground mt-1">
            Store and quickly access all your coding platform profiles
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => resetForm()}>
              <Plus className="w-4 h-4" />
              Add Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProfile ? 'Edit Profile' : 'Add Coding Profile'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., My LeetCode"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Input
                  id="platform"
                  placeholder="e.g., LeetCode, GFG, CodeChef"
                  value={formData.platform}
                  onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Profile URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://leetcode.com/username"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProfile ? 'Save Changes' : 'Add Profile'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profiles Grid */}
      {profiles.length === 0 ? (
        <EmptyState
          icon={Code}
          title="No coding profiles yet"
          description="Add your LeetCode, GFG, CodeChef, and other coding platform profiles here"
          actionLabel="Add Your First Profile"
          onAction={() => setDialogOpen(true)}
          gradient="gradient-sage"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile, index) => (
            <div
              key={profile.id}
              className={cn(
                "group relative p-5 rounded-2xl bg-card border border-border",
                "card-hover shadow-card animate-fade-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getPlatformEmoji(profile.platform)}</span>
                  <div>
                    <h3 className="font-semibold">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground">{profile.platform}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(profile)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(profile.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
              
              <a
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center justify-center gap-2 w-full py-2.5 rounded-xl",
                  "gradient-sage text-sm font-medium",
                  "hover:shadow-hover transition-all"
                )}
              >
                <ExternalLink className="w-4 h-4" />
                Open Profile
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
