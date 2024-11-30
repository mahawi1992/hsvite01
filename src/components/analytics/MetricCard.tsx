import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  trendLabel?: string;
  trendDirection?: 'up' | 'down';
  expanded?: boolean;
  details?: Record<string, number | string>;
}

// Sample trend data - replace with real data
const trendData = Array.from({ length: 7 }, (_, i) => ({
  name: `Day ${i + 1}`,
  value: Math.floor(Math.random() * 100),
}));

const MotionCard = motion.create(Card);

export function MetricCard({
  title,
  value,
  trend,
  trendLabel,
  trendDirection = 'up',
  expanded = false,
  details,
}: MetricCardProps) {
  const theme = useTheme();

  return (
    <MotionCard
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      sx={{
        height: '100%',
        borderRadius: 2,
        background: 'white',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
        cursor: 'pointer',
      }}
    >
      <CardContent sx={{ height: '100%', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
              sx={{
                fontSize: '0.875rem',
                letterSpacing: '0.1px',
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                my: 1,
              }}
            >
              {value}
            </Typography>
          </motion.div>

          <Tooltip title="Click for details">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {trend && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 2,
              gap: 0.5,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
            >
              {trendDirection === 'up' ? (
                <TrendingUpIcon
                  fontSize="small"
                  sx={{
                    color: 'success.main',
                    animation: 'pulse 2s infinite',
                  }}
                />
              ) : (
                <TrendingDownIcon
                  fontSize="small"
                  sx={{
                    color: 'error.main',
                    animation: 'pulse 2s infinite',
                  }}
                />
              )}
            </motion.div>
            <Typography
              variant="body2"
              color={trendDirection === 'up' ? 'success.main' : 'error.main'}
              sx={{ fontWeight: 500 }}
            >
              {trend}
            </Typography>
            {trendLabel && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {trendLabel}
              </Typography>
            )}
          </Box>
        )}

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>
                  7-Day Trend
                </Typography>
                <Box sx={{ height: 100, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        dot={false}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          background: 'white',
                          border: 'none',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                          borderRadius: 4,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>

                {details && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Breakdown
                    </Typography>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 2,
                        mt: 1,
                      }}
                    >
                      {Object.entries(details).map(([key, value]) => (
                        <Box key={key}>
                          <Typography variant="caption" color="text.secondary">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </MotionCard>
  );
}
