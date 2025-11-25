import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

export interface UserProfileData {
  fullName: string;
  studentId: string;
  phone: string;
  department: string;
  courseYear: string;
}

interface UserProfileProps {
  profile: UserProfileData;
  email: string;
  onSave: (profile: UserProfileData) => void;
}

export default function UserProfile({ profile, email, onSave }: UserProfileProps) {
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draft);
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full Name</Label>
                <Input
                  id="profile-name"
                  value={draft.fullName}
                  onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-student-id">Student ID</Label>
                <Input
                  id="profile-student-id"
                  value={draft.studentId}
                  onChange={(e) => setDraft({ ...draft, studentId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone Number</Label>
                <Input
                  id="profile-phone"
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input id="profile-email" value={email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-department">Department</Label>
                <Input
                  id="profile-department"
                  value={draft.department}
                  onChange={(e) => setDraft({ ...draft, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-course">Course & Year</Label>
                <Input
                  id="profile-course"
                  value={draft.courseYear}
                  onChange={(e) => setDraft({ ...draft, courseYear: e.target.value })}
                />
              </div>
            </div>
            <Separator />
            <div className="flex justify-end gap-3">
              <Button type="submit" className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


