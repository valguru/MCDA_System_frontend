export type Invitation = {
    id: number;
    teamName: string;
    senderName: string;
    email: string;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
};