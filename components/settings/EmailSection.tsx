'use client';

import { useState } from 'react';
import { Stack, HStack, Text, Input, Button, Field } from '@chakra-ui/react';
import { LuInfo } from 'react-icons/lu';
import { updateEmail } from '@/lib/actions/account.actions';

interface EmailSectionProps {
  currentEmail: string;
  pendingEmail: string | null;
}

export default function EmailSection({
  currentEmail,
  pendingEmail,
}: EmailSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [emailInput, setEmailInput] = useState(currentEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEdit = () => {
    setEmailInput(currentEmail);
    setError(null);
    setSuccessMessage(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEmailInput(currentEmail);
    setError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setError(null);
    setIsLoading(true);

    const result = await updateEmail(emailInput);

    setIsLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Something went wrong.');
      return;
    }

    setSuccessMessage(result.message ?? 'Verification email sent.');
    setIsEditing(false);
  };

  return (
    <Stack gap="4">
      <Text fontWeight="600" fontSize="subheading" color="text.heading">
        Email Address
      </Text>

      {/* Pending email banner */}
      {pendingEmail && (
        <HStack
          p="4"
          bg="brand.accent"
          border="1px solid"
          borderColor="brand.primaryLight"
          borderRadius="card"
          gap="3"
          alignItems="start"
        >
          <LuInfo
            size={18}
            color="#2F2B77"
            style={{ marginTop: '2px', flexShrink: 0 }}
          />
          <Stack gap="0">
            <Text fontWeight="600" fontSize="small" color="brand.primary">
              Pending Email Change
            </Text>
            <Text fontSize="small" color="text.primary">
              A verification email was sent to{' '}
              <Text as="span" fontWeight="600">
                {pendingEmail}
              </Text>
              . Check your inbox to confirm the change.
            </Text>
          </Stack>
        </HStack>
      )}

      {/* Success message from a just-completed save */}
      {successMessage && !isEditing && (
        <Text fontSize="small" color="green.600">
          {successMessage}
        </Text>
      )}

      {isEditing ? (
        <Stack gap="4">
          <Field.Root>
            <Field.Label color="text.primary" fontWeight="500">
              New Email Address
            </Field.Label>
            <Input
              className="inputForm"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter new email address"
            />
          </Field.Root>

          {error && (
            <Text color="text.error" fontSize="small">
              {error}
            </Text>
          )}

          <HStack>
            <Button
              onClick={handleSave}
              loading={isLoading}
              disabled={!emailInput.trim() || emailInput === currentEmail}
            >
              Save
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </HStack>
        </Stack>
      ) : (
        <HStack justify="space-between" align="center">
          <Text color="text.primary">{currentEmail}</Text>
          <Button size="sm" variant="outline" onClick={handleEdit}>
            Edit
          </Button>
        </HStack>
      )}
    </Stack>
  );
}
