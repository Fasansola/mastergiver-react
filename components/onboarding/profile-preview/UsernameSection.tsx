import ElementsSections from './ElementsSections';

interface UsernameSectionProps {
  username: string;
}
const UsernameSection = ({ username }: UsernameSectionProps) => {
  return <ElementsSections label="Username" value={username} />;
};

export default UsernameSection;
