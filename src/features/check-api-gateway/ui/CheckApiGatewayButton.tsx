type CheckApiGatewayButtonProps = {
  loading: boolean
  onClick: () => void
}

export function CheckApiGatewayButton({
  loading,
  onClick,
}: CheckApiGatewayButtonProps) {
  return (
    <button
      className="poc-api-check-button"
      type="button"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? 'Checking API Gateway...' : 'Check API Gateway'}
    </button>
  )
}
