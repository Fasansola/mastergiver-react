/**
 * EndorsementList — public business profile.
 *
 * Renders the "Community Endorsements" section as a vertical list of quote
 * blocks. Each block shows the endorsement statement, the endorser's name
 * (optional), and the endorsing organisation.
 *
 * Only rendered when the business has at least one endorsement saved.
 */

import { Stack, Text } from '@chakra-ui/react';

interface Endorsement {
  id: string;
  endorsingOrg: string;
  endorserName: string | null;
  endorsementStatement: string;
}

interface EndorsementListProps {
  endorsements: Endorsement[];
}

const EndorsementList = ({ endorsements }: EndorsementListProps) => {
  return (
    <Stack gap="4">
      {endorsements.map((e) => (
        <Stack
          key={e.id}
          bgColor="#FBF9F7"
          p={{ base: '4', md: '8' }}
          borderRadius="12px"
          border="0.5px solid #E9EAED"
          boxShadow="0px 1px 3px 0px #0000000A"
        >
          {/* The endorsement text itself */}
          <Text
            style={{
              fontSize: '16px',
              lineHeight: '160%',
              color: '#212325',
              fontStyle: 'italic',
              margin: 0,
              marginBottom: '12px',
            }}
          >
            &ldquo;{e.endorsementStatement}&rdquo;
          </Text>

          {/* Attribution line: "Name, Organisation" or just "Organisation" */}
          <footer
            style={{ fontSize: '14px', color: '#575C62', fontStyle: 'normal' }}
          >
            {e.endorserName ? (
              <>
                <strong style={{ color: '#27262D' }}>{e.endorserName}</strong>
                {', '}
              </>
            ) : null}
            {e.endorsingOrg}
          </footer>
        </Stack>
      ))}
    </Stack>
  );
};

export default EndorsementList;
