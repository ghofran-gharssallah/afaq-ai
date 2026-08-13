interface BadgeProps {
  text: string;
}

const Badge = ({ text }: BadgeProps) => {
  return (
    <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-medium tracking-widest text-violet-300 uppercase">
      {text}
    </span>
  );
};

export default Badge;