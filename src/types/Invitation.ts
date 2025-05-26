export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface Invitation {
    id: number;
    teamName: string;
    senderName: string;
    email: string;
    status: InvitationStatus;
}