"""added serial number

Revision ID: e94d11ca5326
Revises: 3b132075d15c
Create Date: 2025-02-24 14:19:36.434377

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'e94d11ca5326'
down_revision: Union[str, None] = '3b132075d15c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add serial_number to documents
    op.add_column('documents', sa.Column('serial_number', sa.String(), nullable=True))
    op.create_index(op.f('ix_documents_serial_number'), 'documents', ['serial_number'], unique=True)
    
    # Add serial_number to items
    op.add_column('items', sa.Column('serial_number', sa.String(), nullable=True))
    op.create_index(op.f('ix_items_serial_number'), 'items', ['serial_number'], unique=True)
    
    # Create audit_logs table
    op.create_table('audit_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('table_name', sa.String(), nullable=False),
        sa.Column('record_id', sa.Integer(), nullable=False),
        sa.Column('action', sa.String(), nullable=False),
        sa.Column('old_values', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('new_values', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_audit_logs_table_name'), 'audit_logs', ['table_name'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_audit_logs_table_name'), table_name='audit_logs')
    op.drop_table('audit_logs')
    op.drop_index(op.f('ix_items_serial_number'), table_name='items')
    op.drop_column('items', 'serial_number')
    op.drop_index(op.f('ix_documents_serial_number'), table_name='documents')
    op.drop_column('documents', 'serial_number')
